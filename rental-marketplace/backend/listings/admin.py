from django.contrib import admin
from .models import Item

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'category', 'price_per_day', 'is_available')
    list_filter = ('category', 'is_available')
    search_fields = ('name', 'description')