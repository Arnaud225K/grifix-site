import datetime
import json
import os
# from python_bitrix24.python_bitrix24_django import bitrix24Connection

from . import settings
from django.db.models import Q
from django.http import HttpResponseRedirect, HttpResponse, Http404, JsonResponse
from django.shortcuts import render

from django.core.cache import cache

from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from project_settings.models import ProjectSettings, SocialLink

from filials.models import Filials
from filials.views import get_current_filial

# from menu.models import MenuCatalog
# from robots.models import RobotsTxt


MAX_ITEM_IN_FILE = 20000


def global_views(request):

	current_year = datetime.date.today().year

	project_settings = ProjectSettings.objects.only('id', 'name', 'start_year','site_name').first()
	start_year = project_settings.start_year if project_settings else None
	url_site = project_settings.site_name
	current_url = url_site + request.get_full_path()

	social_link = SocialLink.objects.filter(is_hidden=False)
	version_name = settings.VERSION_NAME
	site_header = settings.SITE_NAME
	site_title = "{} {}".format(site_header, version_name)
	site_name = project_settings.name if project_settings else site_header
	media_url = settings.MEDIA_URL
	static_url = settings.STATIC_URL
	
	# main_menu_list = MenuCatalog.objects.filter(parent__isnull=True, is_hidden=False)
	# catalog_menu_list = MenuCatalog.objects.filter(parent_id=1, is_hidden=False, show_header_menu=True).only('name', 'slug', 'has_child')
	# menu_list_footer_left = MenuCatalog.objects.filter(show_footer_left=True, is_hidden=False).only('name', 'slug')
	# menu_list_footer_rigth = MenuCatalog.objects.filter(show_footer_rigth=True, is_hidden=False).only('name', 'slug')
	
	filials_list = Filials.objects.filter(isHidden=False).only('id', 'name', 'subdomain_name')
	filials_list_base = Filials.objects.filter(isHidden=False, is_base=True).order_by('order_number').only('id', 'name',
																										   'subdomain_name')
	current_filial = get_current_filial(request)

	# cart_items = []

	return locals()




def page404(request, exception):
    response = render(request, 'catalog/404.html')
    response.status_code = 404
    return response

def page500(request):
    response = render(request, 'catalog/500.html')
    response.status_code = 500
    return response