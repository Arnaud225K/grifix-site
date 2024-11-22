import time
import json
import re
from itertools import groupby
from operator import itemgetter
from email.utils import formatdate
from datetime import datetime

from django.core.cache import cache
from django.views.decorators.cache import cache_page

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils.http import http_date, parse_http_date_safe
from django.db.models import Count
from django.db.models import Q
from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse, HttpResponseNotModified, HttpResponsePermanentRedirect

from django.core.cache import cache

from django.shortcuts import render, get_object_or_404
from django.utils.text import slugify
from django.views.generic.base import TemplateView, View
# from transliterate import translit
from django.urls import reverse

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from .models import MenuCatalog
from filials.views import get_current_filial
from o_compania.models import About_us, Advantage, Principle, Task_company, Review




from django.template.loader import render_to_string

from django.db.models import FloatField
from django.db.models.functions import Cast

import logging

SIZE_REVIEW_ALL_INDEX = 6
SIZE_REVIEW_INDEX = 3

SIZE_INDEX = 4
SIZE_SERVICE_INDEX = 6
SIZE_CATEGORIES_INDEX = 6
SIZE_PARTNER_INDEX = 16

TYPE_MENU_ID_MANUFACTURE = 8
TYPE_MENU_ID_SERVICE = 2


def datetime2rfc(updated_at):

    if not isinstance(updated_at, datetime):
        raise ValueError("updated_at doit être un objet datetime")
    dt = time.mktime(updated_at.timetuple())
    return formatdate(dt, usegmt=True)

def _if_modified_since(date_server, value):
    value = parse_http_date_safe(value)
    date_server = parse_http_date_safe(date_server)
    return date_server <= value

#----Get review list by filial -----#
def get_review(current_filial):
    list_review = Review.objects.filter(
        Q(is_hidden=False) & (Q(filial=current_filial) | Q(filial__isnull=True))
    ).order_by("-created_at")
    return list_review




class IndexView(TemplateView):
    template_name = "catalog/index.html"

    def get(self, request):
        
        is_index = True
        
        # news_list = News.objects.filter(is_show_main=True, is_hidden=False)[:SIZE_SALE_INDEX]
        # articles_list = Articles.objects.filter(is_show_main=True, is_hidden=False)[:SIZE_SALE_INDEX]
        # spec_list = Product.objects.filter(is_spec=True, is_home=True, is_hidden=False).order_by('order_number', '-price')[:SIZE_SALE_INDEX]
        # categories_list = MenuCatalog.objects.filter(is_hidden=False, parent_id=1, type_menu_id=6)
        # popular_categories = MenuCatalog.objects.filter(type_menu_id__in=[6, 7], flag_main=True, is_hidden=False)[:SIZE_SALE_INDEX]
        # partner_list = Partner.objects.filter(is_hidden=False).order_by('order_number')[:SIZE_PARTNER_INDEX]       
        
        # # Get the first 3 categories_list and the rest
        # categories_list_first_three = categories_list[:3]
        # categories_list_links = categories_list[3:9]


        # index_title_page = get_static_text(request, locals(), INDEX_TITLE_PAGE)
        # index_meta_description = get_static_text(request, locals(), INDEX_META_DESCRIPTION)
        # index_meta_keywords = get_static_text(request, locals(), INDEX_META_KEYWORDS)
        # s_main_work = get_static_text(request, locals(), 's_main_work')
        # s_main_delivery = get_static_text(request, locals(), 's_main_delivery')
        # s_main_answers = get_static_text(request, locals(), 's_main_answers')

        context = {
            # 'spec_list':spec_list,
            # 'news_list':news_list,
            # 'articles_list':articles_list,
            # 'partner_list':partner_list,
            # 'categories_list_links':categories_list_links,
            # 'categories_list_first_three':categories_list_first_three,
            # 'popular_categories':popular_categories,
            # 'index_title_page':index_title_page,
            # 'index_meta_description':index_meta_description,
            # 'index_meta_keywords':index_meta_keywords,
            # 's_main_work':s_main_work,
            # 's_main_delivery':s_main_delivery,
            # 's_main_answers':s_main_answers,
            'is_index':is_index,
        }

        return render(request, self.template_name, context)
    


class MenuView(View):

    def get(self, request, menu_slug):
        # Préférer le préchargement des régions
        current_menu = get_object_or_404(MenuCatalog.objects.prefetch_related('region'), slug=menu_slug)
        current_filial = get_current_filial(request)

        # Vérifiez si la filiale actuelle est dans les régions du menu
        if current_menu.region.exists() and not current_menu.region.filter(id=current_filial.id).exists():
            raise Http404("This menu is not available for the current filial.")

        # Initialisation des variables
        about_us_list = None
        zadachi_compania = []
        princip_raboty = []
        preimushestva = []
        review_list_all = []
        review_list = []

        #GET THE REVIEW
        review_data = cache.get(f'reviews_all_{current_filial.id}')
        if review_data is None:
            review_list_all = get_review(current_filial)[:SIZE_REVIEW_ALL_INDEX]
            cache.set(f'reviews_all_{current_filial.id}', review_list_all, timeout=60 * 15)
        else:
            review_list_all = review_data

        if current_menu.slug == "o-nas":
            about_us_data = cache.get(f'about_us_{current_menu.slug}')
            if about_us_data is None:
                about_us_list = About_us.objects.filter(is_hidden=False).first()
                if about_us_list:
                    zadachi_compania = about_us_list.rel_about_task.filter(is_hidden=False)[:SIZE_INDEX]
                    princip_raboty = about_us_list.rel_about_principle.filter(is_hidden=False)[:SIZE_INDEX]
                    preimushestva = about_us_list.rel_about_advantage.filter(is_hidden=False)[:SIZE_INDEX]
                cache.set(f'about_us_{current_menu.slug}', (about_us_list, zadachi_compania, princip_raboty, preimushestva), timeout=60 * 15)
            else:
                about_us_list, zadachi_compania, princip_raboty, preimushestva = about_us_data


            review_list = review_list_all[:SIZE_REVIEW_INDEX]


        context = {
            'current_menu': current_menu,
            'about_us_list': about_us_list,
            'zadachi_compania': zadachi_compania,
            'princip_raboty': princip_raboty,
            'preimushestva': preimushestva,
            'review_list_all':review_list_all,
            'review_list': review_list,
        }

        # Gestion de If-Modified-Since
        last_modified = request.META.get('HTTP_IF_MODIFIED_SINCE')
        if last_modified and current_menu.updated_at:
            if _if_modified_since(datetime2rfc(current_menu.updated_at), last_modified):
                return HttpResponseNotModified()

        response = render(request, current_menu.type_menu.template, context)
        response['Last-Modified'] = datetime2rfc(current_menu.updated_at)
        
        return response

# class MenuView(View):

#     def get(self, request, menu_slug):
#         # Préférer le préchargement des régions
#         current_menu = get_object_or_404(MenuCatalog.objects.prefetch_related('region'), slug=menu_slug)
#         current_filial = get_current_filial(request)

#         # Vérifiez si le menu a des régions définies
#         if current_menu.region.exists():
#             # Vérifiez si la filiale actuelle est dans ces régions
#             if not current_menu.region.filter(id=current_filial.id).exists():
#                 raise Http404("This menu is not available for the current filial.")

#         # Initialisation des variables
#         about_us_list = None
#         zadachi_compania = []
#         princip_raboty = []
#         preimushestva = []
#         review_list = []

#         # Récupérer toutes les critiques
#         review_list_all = get_review(current_filial)

#         # Obtenez seulement les 3 premières critiques
#         review_list = review_list_all[:3]

#         if current_menu.slug == "o-nas":
#             about_us_list = About_us.objects.filter(is_hidden=False).first()
#             if about_us_list:
#                 zadachi_compania = about_us_list.rel_about_task.filter(is_hidden=False)[:4]
#                 princip_raboty = about_us_list.rel_about_principle.filter(is_hidden=False)[:4]
#                 preimushestva = about_us_list.rel_about_advantage.filter(is_hidden=False)[:4]

#         # Préparer le contexte pour le rendu
#         context = {
#             'current_menu': current_menu,
#             'about_us_list': about_us_list,
#             'zadachi_compania': zadachi_compania,
#             'princip_raboty': princip_raboty,
#             'preimushestva': preimushestva,
#             'review_list': review_list,
#         }

#         # Gestion de If-Modified-Since
#         last_modified = request.META.get('HTTP_IF_MODIFIED_SINCE')
#         if last_modified and current_menu.updated_at:
#             if _if_modified_since(datetime2rfc(current_menu.updated_at), last_modified):
#                 return HttpResponseNotModified()

#         response = render(request, current_menu.type_menu.template, context)
#         response['Last-Modified'] = datetime2rfc(current_menu.updated_at)

#         return response

class CatalogView(View):
    """ Class for displaying the catalog page """
    template_name = "catalog/product_list.html"

    def get(self, request, menu_slug):
        # Check if the menu exists
        current_menu = get_object_or_404(MenuCatalog, slug=menu_slug, is_hidden=False)


        # Prepare context data for rendering
        context = {
            'current_menu': current_menu,
        }

        # Корректное формирование ответа сервера на запрос If-Modified-Since
        last_modified = request.META.get('HTTP_IF_MODIFIED_SINCE')
        if last_modified and current_menu.updated_at:
            if _if_modified_since(datetime2rfc(current_menu.updated_at), last_modified):
                return HttpResponseNotModified()
        response = render(request, current_menu.type_menu.template, context)
        response['Last-Modified'] = datetime2rfc(current_menu.updated_at)
        return response