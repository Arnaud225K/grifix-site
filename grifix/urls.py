"""
URL configuration for grifix project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve
# from filials.views import RobotsView
from . import settings
import debug_toolbar
from django.conf.urls.static import static
from .settings import SITE_NAME
# from .views import page404, page500, city_json


#Custom admin site
admin.site.site_header = "Администрирование " + SITE_NAME
admin.site.site_title = SITE_NAME



urlpatterns = [
    path('grifixadmin/', admin.site.urls),
]

#Activate debug toolbar url
if settings.DEBUG:
    urlpatterns += [
        path('__debug__/', include('debug_toolbar.urls')),
    ]

urlpatterns += [
    # path('grifixadmin/', admin.site.urls),
    #Custom App url
    path('cart/', include('checkout.urls')),
    path('spec/', include('offers.urls')),
    path('',include('menu.urls')),

    #Custom library url
    path("ckeditor5/", include('django_ckeditor_5.urls')),
]

#Serve static files
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)	
urlpatterns += [
    re_path(r'media/(?P<path>.*)$', serve, {'document_root': settings.WWW_ROOT}),
    ]