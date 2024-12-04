from django.urls import path , re_path

from django.views.decorators.cache import cache_page
from .views import IndexView, MenuView, CatalogView, ProductView, PriceView, GetSurfacesView

app_name = 'menu'
urlpatterns = [
	path('', IndexView.as_view(), name='index'),
    path('<str:menu_slug>/', MenuView.as_view(), name='menu'),
    path('product/<str:product_slug>/', ProductView.as_view(), name='product'),
    path('<slug:menu_slug>/', CatalogView.as_view(), name='catalog'),
    # path('product_add', ProductAddView.as_view(), name='product_add'),
    # path('product_del', ProductDelView.as_view(), name='product_del'),
    # path('update_cart', ProductUpdView.as_view(), name="update_cart"),
	# path('product_get_price/<int:pk>', ProductGetPrice.as_view(), name='product_get_fast'),
    # path('get_filter_url', GetFilterUrl.as_view(), name='get_filter_url'),
    # path('filter_spec_offer', FilterSpecialOfferView.as_view(), name='filter_spec_offer'),
    path('get_surfaces', GetSurfacesView.as_view(), name='get_surfaces'),
    path('get_price', PriceView.as_view(), name='get_price'),
    re_path(r'^(?P<menu_slug>[-\w]+)/([^*]*)/$', CatalogView.as_view(), name='catalog'),
]