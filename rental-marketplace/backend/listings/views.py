from rest_framework import viewsets, permissions
from .models import Item
from .serializers import ItemSerializer

class IsOwnerRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'owner'

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [IsOwnerRole()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    def get_queryset(self):
    # Return items that aren't 'rented'
        return Item.objects.filter(is_available=True)