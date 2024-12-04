from django.urls import path

from .views import OffersView

app_name = 'offers'
urlpatterns = [
	path('', OffersView.as_view(), name='index'),
	# path('<str:slug>/', OffersItemView.as_view(), name='offer-detail'),
]