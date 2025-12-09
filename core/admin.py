from django.contrib import admin

from .models import (
    User,
    ClassRoom,
    ParentProfile,
    Student,
    Attendance,
    Exam,
    Result,
    Meeting,
    Notification,
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "first_name", "last_name", "role", "is_staff")
    list_filter = ("role", "is_staff", "is_superuser")
    search_fields = ("username", "email", "first_name", "last_name")


@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ("name", "section")
    search_fields = ("name", "section")


@admin.register(ParentProfile)
class ParentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone")
    search_fields = ("user__username", "user__first_name", "user__last_name")


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("name", "roll_number", "classroom", "parent")
    search_fields = ("name", "roll_number")
    list_filter = ("classroom",)


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("student", "date", "status", "marked_by")
    list_filter = ("status", "date", "student__classroom")


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ("name", "subject", "classroom", "date")
    list_filter = ("classroom", "date")


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ("exam", "student", "marks", "total_marks", "grade")
    list_filter = ("exam", "grade")


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ("title", "classroom", "date", "time", "location")
    list_filter = ("classroom", "date")


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("parent", "type", "title", "date", "is_read")
    list_filter = ("type", "is_read", "date")

