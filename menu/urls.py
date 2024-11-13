from django.urls import path , re_path

from django.views.decorators.cache import cache_page
from .views import IndexView

app_name = 'menu'
urlpatterns = [
	path('', IndexView.as_view(), name='index'),
]