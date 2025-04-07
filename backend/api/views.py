from rest_framework.permissions import AllowAny
from rest_framework import status
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import action
from .serializers import UserSerializer, NoteSerializer, UserSerializers, BookingStatusSerializer, showProfileSerializer, VenueSerializer, BookingSerializer, VenueRegisterSerializer
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
            print(
                f"Error retrieving user profile for username {username}: {str(e)}")
            return Response(
                {"error": f"Unable to retrieve profile for username {username}"},
                status=status.HTTP_404_NOT_FOUND
            )


class VenueViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer


class VenueViewList(APIView):
    permission_classes = [AllowAny]

    def get(self, request, venueownerid=None):
        # Check if 'id' query parameter is passed to get a single venue
        venue_id = request.query_params.get('id')
        if venue_id:
            venue = Venue.objects.filter(pk=venue_id).first()
            if venue:
                serializer = VenueSerializer(venue)
                return Response(serializer.data)
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # If venueownerid is in the path, filter by it
        if venueownerid:
            venues = Venue.objects.filter(venueownerid=venueownerid)
        else:
            venues = Venue.objects.all()

        serializer = VenueSerializer(venues, many=True)
        return Response(serializer.data)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return BookingStatusSerializer
        return BookingSerializer

    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()

            # Log what we're receiving
            print(f"Update request data: {request.data}")

            serializer = self.get_serializer(
                instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)

            return Response(serializer.data)
        except Exception as e:
            # Log the error
            print(f"Error updating booking: {str(e)}")
            return Response(
                {"detail": f"Error updating booking: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)


class VenueListCreate(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueRegisterSerializer
    permission_classes = [AllowAny]
