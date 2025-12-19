from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    )
    
    item = models.ForeignKey('listings.Item', on_delete=models.CASCADE)
    renter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.renter.username} renting {self.item.name}"
class Review(models.Model):
    # Relates to the specific booking (Requirement FR10)
    booking = models.OneToOneField('rentals.Booking', on_delete=models.CASCADE, related_name='review')
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Rating from 1 to 5 as specified on page 66
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.rating} by {self.reviewer.username}"
class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-timestamp'] # Newest messages first

    def __str__(self):
        return f"From {self.sender} to {self.receiver}"
class Payment(models.Model):
    # Links to a specific booking (Table 3.4)
    booking = models.OneToOneField('rentals.Booking', on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, default='paid') # paid, failed, refunded
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of {self.amount} for {self.booking}"
# backend/rentals/models.py

class Delivery(models.Model):
    STATUS_CHOICES = (('scheduled', 'Scheduled'), ('in_transit', 'In Transit'), ('delivered', 'Delivered'))
    booking = models.OneToOneField('rentals.Booking', on_delete=models.CASCADE)
    delivery_agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, limit_choices_to={'role': 'delivery'})
    pickup_time = models.DateTimeField(null=True, blank=True)
    delivery_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')

class Complaint(models.Model):
    STATUS_CHOICES = (('open', 'Open'), ('resolved', 'Resolved'), ('escalated', 'Escalated'))
    booking = models.ForeignKey('rentals.Booking', on_delete=models.CASCADE)
    filed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='filed_complaints')
    target_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_complaints')
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)