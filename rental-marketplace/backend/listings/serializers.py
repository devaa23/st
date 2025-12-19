from rest_framework import serializers
from .models import Item

class ItemSerializer(serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Item
        fields = [
            'id', 'owner', 'owner_name', 'name', 
            'category', 'description', 'price_per_day', 
            'image', 'is_available'
        ]
        read_only_fields = ['owner'] # Owner is set automatically in the view
class ItemSerializer(serializers.ModelSerializer):
    avg_rating = serializers.SerializerMethodField()

    def get_avg_rating(self, obj):
        from rentals.models import Review
        reviews = Review.objects.filter(booking__item=obj)
        if reviews.exists():
            return sum(r.rating for r in reviews) / reviews.count()
        return None