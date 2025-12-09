from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        PRINCIPAL = "PRINCIPAL", "Principal"
        TEACHER = "TEACHER", "Teacher"
        STAFF = "STAFF", "Staff"
        PARENT = "PARENT", "Parent"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.PARENT,
    )


class ClassRoom(models.Model):
    name = models.CharField(max_length=50)
    section = models.CharField(max_length=10)

    class Meta:
        unique_together = ("name", "section")

    def __str__(self) -> str:  # pragma: no cover - simple representation
        return f"{self.name} - {self.section}"


class ParentProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="parent_profile")
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.user.get_full_name() or self.user.username


class Student(models.Model):
    name = models.CharField(max_length=255)
    roll_number = models.CharField(max_length=50)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, related_name="students")
    parent = models.ForeignKey(ParentProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="students")
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    photo = models.ImageField(upload_to="students/", blank=True, null=True)

    class Meta:
        unique_together = ("roll_number", "classroom")

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name} ({self.roll_number})"


class Attendance(models.Model):
    class Status(models.TextChoices):
        PRESENT = "PRESENT", "Present"
        ABSENT = "ABSENT", "Absent"
        LATE = "LATE", "Late"

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices)
    marked_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="marked_attendance")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "date")
        ordering = ["-date", "student__roll_number"]


class Exam(models.Model):
    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=100)
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, related_name="exams")
    date = models.DateField(null=True, blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name} - {self.subject} ({self.classroom})"


class Result(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="results")
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="results")
    marks = models.FloatField()
    total_marks = models.FloatField()
    grade = models.CharField(max_length=5)
    remarks = models.TextField(blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_results")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("exam", "student")


class Meeting(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    classroom = models.ForeignKey(ClassRoom, on_delete=models.CASCADE, related_name="meetings")
    location = models.CharField(max_length=255)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_meetings")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.title


class Notification(models.Model):
    class Types(models.TextChoices):
        ATTENDANCE = "ATTENDANCE", "Attendance Alert"
        EXAM_RESULT = "EXAM_RESULT", "Exam Result"
        MEETING = "MEETING", "Parent Meeting"

    parent = models.ForeignKey(ParentProfile, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=20, choices=Types.choices)
    title = models.CharField(max_length=200)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-date"]

