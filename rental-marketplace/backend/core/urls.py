from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import RegisterView, UserMeView
from rest_framework.routers import DefaultRouter
from rentals.views import BookingViewSet, ReviewViewSet, MessageViewSet, PaymentViewSet,DeliveryViewSet,ComplaintViewSet # <--- Add this
    

from listings.views import ItemViewSet
from rentals.views import BookingViewSet 
from rentals.views import BookingViewSet, ReviewViewSet
from rentals.views import BookingViewSet, ReviewViewSet, MessageViewSet
# Initialize the router for listings
router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/register/', RegisterView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user-me/', UserMeView.as_view()),
    
]
router.register(r'payments', PaymentViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'deliveries', DeliveryViewSet, basename='deliveries') # <--- Add this
router.register(r'complaints', ComplaintViewSet)
# This allows the browser to see uploaded images during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)