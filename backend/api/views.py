from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from .serializers import UserSerializer, NoteSerializer, UserSerializers, showProfileSerializer, VenueSerializer, BookingSerializer
from .models import Note, UserProfile, Venue, Booking
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Note, UserProfile
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authentication import SessionAuthentication
from django.http import JsonResponse
from rest_framework.parsers import JSONParser
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_GET
from django.contrib.auth.decorators import login_required
from django.http import Http404


class ShowProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = showProfileSerializer(request.user)
        return Response(serializer.data)


class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileViewSet(generics.CreateAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]


class UserProfileDetailView(APIView):
    """
    View to retrieve a specific user profile by username.
    """
    permission_classes = [AllowAny]

    def get(self, request, username, *args, **kwargs):
        try:
            # Retrieve the user profile by username
            user_profile = get_object_or_404(UserProfile, username=username)
            
            # Serialize the user profile
            serializer = UserSerializers(user_profile)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Log the error for debugging
            print(f"Error retrieving user profile for username {username}: {str(e)}")
            return Response(
                {"error": f"Unable to retrieve profile for username {username}"},
                status=status.HTTP_404_NOT_FOUND
            )

class VenueViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]  
    queryset=Venue.objects.all()
    serializer_class = VenueSerializer
    
    
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]