from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    MeView,
    ClassRoomViewSet,
    StudentViewSet,
    AttendanceBulkCreateView,
    AttendanceByClassView,
    AttendanceByStudentView,
    ExamViewSet,
    ResultBulkCreateView,
    ResultByStudentView,
    ResultByExamView,
    MeetingViewSet,
    NotificationListView,
    NotificationMarkReadView,
)
from .parent_api import parent_admin_view
from .staff_api import staff_user_view


router = DefaultRouter()
router.register(r'classrooms', ClassRoomViewSet, basename='classroom')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'meetings', MeetingViewSet, basename='meeting')


urlpatterns = [
    path('me/', MeView.as_view(), name='me'),
    path('', include(router.urls)),
    path('attendance/bulk_create/', AttendanceBulkCreateView.as_view(), name='attendance-bulk-create'),
    path('attendance/class/<int:class_id>/', AttendanceByClassView.as_view(), name='attendance-by-class'),
    path('attendance/student/<int:student_id>/', AttendanceByStudentView.as_view(), name='attendance-by-student'),
    path('results/bulk_create/', ResultBulkCreateView.as_view(), name='results-bulk-create'),
    path('results/student/<int:student_id>/', ResultByStudentView.as_view(), name='results-by-student'),
    path('results/exam/<int:exam_id>/', ResultByExamView.as_view(), name='results-by-exam'),
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<int:notification_id>/mark_read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('parents/', parent_admin_view, name='parents-admin'),
    path('staff-users/', staff_user_view, name='staff-users-admin'),
]
