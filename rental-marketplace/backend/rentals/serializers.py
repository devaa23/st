from rest_framework import serializers
from .models import Booking
from .models import Booking, Review
from .models import Booking, Review, Message 
from .models import Booking, Review, Message, Payment, Complaint,Delivery
class BookingSerializer(serializers.ModelSerializer):
    # These read-only fields allow React to show names instead of just IDs
    item_name = serializers.ReadOnlyField(source='item.name')
    renter_name = serializers.ReadOnlyField(source='renter.username')

    class Meta:
        model = Booking
        fields = [
            'id', 'item', 'item_name', 'renter', 
            'renter_name', 'start_date', 'end_date', 
            'status', 'created_at'
        ]
        # These are set by the server, not the user
        read_only_fields = ['renter', 'status', 'created_at']
class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.ReadOnlyField(source='reviewer.username')

    class Meta:
        model = Review
        fields = ['id', 'booking', 'reviewer', 'reviewer_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['reviewer']
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    receiver_name = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp', 'is_read']
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    receiver_name = serializers.ReadOnlyField(source='receiver.username')

    class Meta:
        model = Message  # This will now work!
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp', 'is_read']
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
class DeliverySerializer(serializers.ModelSerializer):
    booking_item_name = serializers.ReadOnlyField(source='booking.item.name')
    owner_name = serializers.ReadOnlyField(source='booking.item.owner.username')

    class Meta:
        model = Delivery
        fields = ['id', 'booking', 'booking_item_name', 'owner_name', 'delivery_agent', 'pickup_time', 'delivery_time', 'status']

class ComplaintSerializer(serializers.ModelSerializer):
    filed_by_name = serializers.ReadOnlyField(source='filed_by.username')
    target_user_name = serializers.ReadOnlyField(source='target_user.username')

    class Meta:
        model = Complaint
        fields = ['id', 'booking', 'filed_by', 'filed_by_name', 'target_user', 'target_user_name', 'reason', 'status', 'created_at']