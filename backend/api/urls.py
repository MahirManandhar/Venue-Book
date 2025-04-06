from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()

router.register(r'bookings', views.BookingViewSet, basename='bookings')
router.register(r'venueRegister', views.VenueListCreate,
                basename='venueRegister')


urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path('register/', views.UserProfileViewSet.as_view(), name='register'),
    path("userDetails/", views.ShowProfile.as_view(), name="user-detail"),
    path('userProfiles/', views.UserProfileDetailView.as_view(),
         name='user-profile'),
    path('userProfiles/<str:username>/', views.UserProfileDetailView.as_view(),
         name='user-profile'),
    path('venue/', views.VenueViewSet.as_view(), name='venue-list'),
    path('venue/owner/<int:venueownerid>/', views.VenueViewSet.as_view(),
         name='venue'),
    path('', include(router.urls))
]
