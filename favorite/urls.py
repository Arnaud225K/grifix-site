from django.urls import path
# from .views import AddToFavorites, GetFavorites, FavoritesPageView
from .views import ManageFavorites, FavoritesPageView, FavoritesStatusView

app_name = 'favorite'

urlpatterns = [
    path('', FavoritesPageView.as_view(), name='favorites'),
    path('get_favorites/', FavoritesPageView.as_view(), name='get_favorites'),
    path('manage_favorites/', ManageFavorites.as_view(), name='manage_favorites'),
    path('status_favorites/', FavoritesStatusView.as_view(), name='status_favorites'),
]