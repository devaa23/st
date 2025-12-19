from rest_framework import viewsets, permissions
from .models import Booking
from .serializers import BookingSerializer
from .models import Booking, Review , Payment # <--- Add 'Review' here
from .serializers import BookingSerializer, ReviewSerializer # <--- Add 
from .serializers import BookingSerializer, ReviewSerializer, MessageSerializer ,PaymentSerializer# <--- 
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Set the logged-in user as the renter
        serializer.save(renter=self.request.user)

    def get_queryset(self):
        user = self.request.user
        # Owners see requests for their items, Renters see their own requests
        if user.role == 'owner':
            return Booking.objects.filter(item__owner=user)
        return Booking.objects.filter(renter=user)
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)
class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Users only see messages they sent or received
        user = self.request.user
        return Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user))

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Save the payment
        payment = serializer.save()
        # Update the associated booking status (Workflow logic)
        booking = payment.booking
        booking.status = 'completed' 
        booking.save()