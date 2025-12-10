from django.contrib.auth import get_user_model
from rest_framework import serializers

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


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "role", "is_superuser"]


class ClassRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassRoom
        fields = ["id", "name", "section"]


class ParentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ParentProfile
        fields = ["id", "user", "phone", "address"]


class StudentSerializer(serializers.ModelSerializer):
    classroom = ClassRoomSerializer(read_only=True)
    classroom_id = serializers.PrimaryKeyRelatedField(
        queryset=ClassRoom.objects.all(), source="classroom", write_only=True
    )
    parent = ParentProfileSerializer(read_only=True)
    parent_id = serializers.PrimaryKeyRelatedField(
        queryset=ParentProfile.objects.all(),
        source="parent",
        write_only=True,
        allow_null=True,
        required=False,
    )

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "roll_number",
            "classroom",
            "classroom_id",
            "parent",
            "parent_id",
            "address",
            "phone",
            "email",
            "photo",
        ]


class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), source="student", write_only=True
    )

    class Meta:
        model = Attendance
        fields = [
            "id",
            "student",
            "student_id",
            "date",
            "status",
            "marked_by",
            "created_at",
        ]
        read_only_fields = ["marked_by", "created_at"]


class AttendanceBulkCreateSerializer(serializers.Serializer):
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), source="student"
    )
    date = serializers.DateField()
    status = serializers.ChoiceField(choices=Attendance.Status.choices)


class ExamSerializer(serializers.ModelSerializer):
    classroom = ClassRoomSerializer(read_only=True)
    classroom_id = serializers.PrimaryKeyRelatedField(
        queryset=ClassRoom.objects.all(), source="classroom", write_only=True
    )

    class Meta:
        model = Exam
        fields = ["id", "name", "subject", "classroom", "classroom_id", "date"]


class ResultSerializer(serializers.ModelSerializer):
    exam = ExamSerializer(read_only=True)
    exam_id = serializers.PrimaryKeyRelatedField(
        queryset=Exam.objects.all(), source="exam", write_only=True
    )
    student = StudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), source="student", write_only=True
    )

    class Meta:
        model = Result
        fields = [
            "id",
            "exam",
            "exam_id",
            "student",
            "student_id",
            "marks",
            "total_marks",
            "grade",
            "remarks",
            "created_by",
            "created_at",
        ]
        read_only_fields = ["created_by", "created_at"]


class ResultBulkCreateSerializer(serializers.Serializer):
    exam_id = serializers.PrimaryKeyRelatedField(
        queryset=Exam.objects.all(), source="exam"
    )
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(), source="student"
    )
    marks = serializers.FloatField()
    total_marks = serializers.FloatField()
    grade = serializers.CharField(max_length=5)
    remarks = serializers.CharField(allow_blank=True, required=False)


class MeetingSerializer(serializers.ModelSerializer):
    classroom = ClassRoomSerializer(read_only=True)
    classroom_id = serializers.PrimaryKeyRelatedField(
        queryset=ClassRoom.objects.all(), source="classroom", write_only=True
    )

    class Meta:
        model = Meeting
        fields = [
            "id",
            "title",
            "description",
            "date",
            "time",
            "classroom",
            "classroom_id",
            "location",
            "created_by",
            "created_at",
        ]
        read_only_fields = ["created_by", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "type", "title", "message", "date", "is_read"]
