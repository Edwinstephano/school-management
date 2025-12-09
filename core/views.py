from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    ClassRoom,
    ParentProfile,
    Student,
    Attendance,
    Exam,
    Result,
    Meeting,
    Notification,
)
from .permissions import IsAdminOrPrincipal, IsTeacherOrStaff, IsParent
from .serializers import (
    UserSerializer,
    ClassRoomSerializer,
    StudentSerializer,
    AttendanceSerializer,
    AttendanceBulkCreateSerializer,
    ExamSerializer,
    ResultSerializer,
    ResultBulkCreateSerializer,
    MeetingSerializer,
    NotificationSerializer,
)


User = get_user_model()


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ClassRoomViewSet(viewsets.ModelViewSet):
    queryset = ClassRoom.objects.all().order_by("name", "section")
    serializer_class = ClassRoomSerializer
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrPrincipal()]


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related("classroom", "parent").all()
    serializer_class = StudentSerializer
    def get_permissions(self):
        # Allow any authenticated user (including parents) to view students,
        # but only admin/principal can modify.
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [IsAdminOrPrincipal()]


class AttendanceBulkCreateView(generics.GenericAPIView):
    serializer_class = AttendanceBulkCreateSerializer
    permission_classes = [IsTeacherOrStaff]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        records = []
        notifications = []
        for item in serializer.validated_data:
            student = item["student"]
            date = item["date"]
            status_value = item["status"]
            attendance, _created = Attendance.objects.update_or_create(
                student=student,
                date=date,
                defaults={"status": status_value, "marked_by": request.user},
            )
            records.append(attendance)

            if (
                status_value == Attendance.Status.ABSENT
                and student.parent is not None
            ):
                notifications.append(
                    Notification(
                        parent=student.parent,
                        type=Notification.Types.ATTENDANCE,
                        title="Attendance Alert",
                        message=f"{student.name} is absent on {date}.",
                    )
                )

        if notifications:
            Notification.objects.bulk_create(notifications)

        return Response(
            AttendanceSerializer(records, many=True).data,
            status=status.HTTP_201_CREATED,
        )


class AttendanceByClassView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [IsTeacherOrStaff | IsAdminOrPrincipal]

    def get_queryset(self):
        class_id = self.kwargs["class_id"]
        date_param = self.request.query_params.get("date")
        qs = Attendance.objects.select_related("student", "student__classroom").filter(
            student__classroom_id=class_id
        )
        if date_param:
            qs = qs.filter(date=date_param)
        return qs


class AttendanceByStudentView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        student_id = self.kwargs["student_id"]
        qs = Attendance.objects.select_related("student", "student__classroom").filter(
            student_id=student_id
        )
        return qs


class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.select_related("classroom").all()
    serializer_class = ExamSerializer
    permission_classes = [IsTeacherOrStaff | IsAdminOrPrincipal]


class ResultBulkCreateView(generics.GenericAPIView):
    serializer_class = ResultBulkCreateSerializer
    permission_classes = [IsTeacherOrStaff | IsAdminOrPrincipal]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        results = []
        notifications = []
        for item in serializer.validated_data:
            exam = item["exam"]
            student = item["student"]
            result, _created = Result.objects.update_or_create(
                exam=exam,
                student=student,
                defaults={
                    "marks": item["marks"],
                    "total_marks": item["total_marks"],
                    "grade": item["grade"],
                    "remarks": item.get("remarks", ""),
                    "created_by": request.user,
                },
            )
            results.append(result)

            if student.parent is not None:
                notifications.append(
                    Notification(
                        parent=student.parent,
                        type=Notification.Types.EXAM_RESULT,
                        title=f"Exam Result: {exam.name}",
                        message=(
                            f"{student.name}'s result for {exam.subject}: "
                            f"{result.marks}/{result.total_marks} (Grade {result.grade})."
                        ),
                    )
                )

        if notifications:
            Notification.objects.bulk_create(notifications)

        return Response(
            ResultSerializer(results, many=True).data,
            status=status.HTTP_201_CREATED,
        )


class ResultByStudentView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        student_id = self.kwargs["student_id"]
        return Result.objects.select_related("exam", "student").filter(student_id=student_id)


class ResultByExamView(generics.ListAPIView):
    serializer_class = ResultSerializer
    permission_classes = [IsTeacherOrStaff | IsAdminOrPrincipal]

    def get_queryset(self):
        exam_id = self.kwargs["exam_id"]
        return Result.objects.select_related("exam", "student", "student__classroom").filter(
            exam_id=exam_id
        )


class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.select_related("classroom").all()
    serializer_class = MeetingSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminOrPrincipal()]
        return [permissions.IsAuthenticated()]

    @transaction.atomic
    def perform_create(self, serializer):
        meeting = serializer.save(created_by=self.request.user)
        students = Student.objects.filter(classroom=meeting.classroom).select_related("parent")
        notifications = []
        for student in students:
            if student.parent is None:
                continue
            notifications.append(
                Notification(
                    parent=student.parent,
                    type=Notification.Types.MEETING,
                    title=f"Parent Meeting: {meeting.title}",
                    message=(
                        f"Meeting scheduled on {meeting.date} at {meeting.time} "
                        f"for class {meeting.classroom}. Location: {meeting.location}."
                    ),
                )
            )
        if notifications:
            Notification.objects.bulk_create(notifications)


class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsParent]

    def get_queryset(self):
        parent_profile = getattr(self.request.user, "parent_profile", None)
        if not parent_profile:
            return Notification.objects.none()
        return Notification.objects.filter(parent=parent_profile)


class NotificationMarkReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsParent]
    lookup_url_kwarg = "notification_id"

    def get_queryset(self):
        parent_profile = getattr(self.request.user, "parent_profile", None)
        if not parent_profile:
            return Notification.objects.none()
        return Notification.objects.filter(parent=parent_profile)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_read = True
        instance.save(update_fields=["is_read"])
        return Response(self.get_serializer(instance).data)

