from rest_framework import viewsets, permissions
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set the renter as the logged-in user
        serializer.save(renter=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'owner':
            # Owners see bookings for THEIR items
            return Booking.objects.filter(item__owner=user)
        # Renters see THEIR own requests
        return Booking.objects.filter(renter=user)