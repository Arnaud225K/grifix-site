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
from .models import MenuCatalog, House, PriceHouse
from filials.views import get_current_filial
from o_compania.models import About_us, Advantage, Principle, Task_company, Review
from static_text.views import get_static_text
from material.models import Material

from offers.models import Offers
from services.models import Services

from django.template.loader import render_to_string

from django.db.models import FloatField
from django.db.models.functions import Cast
from django.db.models import Min


import logging

SIZE_REVIEW_ALL_INDEX = 6
SIZE_REVIEW_INDEX = 3

SIZE_INDEX = 4
SIZE_SERVICE_INDEX = 6
SIZE_CATEGORIES_INDEX = 6
SIZE_PARTNER_INDEX = 16

SIZE_OFFERS_INDEX = 4

SIZE_HIT_INDEX = 4

TYPE_MENU_ID_MANUFACTURE = 8
TYPE_MENU_ID_SERVICE = 2


INDEX_TITLE_PAGE = 'index_title_page'
INDEX_META_DESCRIPTION = 'index_meta_description'
INDEX_META_KEYWORDS = 'index_meta_keywords'

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


def get_material_filter(product_list):
    # Retrieve all the materials associated with the houses in product_list
    materials = Material.objects.filter(rel_material_price__house__in=product_list).distinct()
    return materials

def get_floor_filter(product_list=None):
    return (
        product_list
        .select_related('rel_floor')
        .exclude(floor__slug='None')
        .values('floor__number', 'floor__slug')
        .annotate(dcount_floor=Count('floor'))
        .order_by('floor__number')
        .distinct()
    )

class IndexView(TemplateView):
    template_name = "catalog/index.html"

    def get(self, request):
        
        is_index = True
        
        offers_list_main = Offers.objects.filter(is_show_main=True, is_hidden=False)[:SIZE_OFFERS_INDEX]
        about_us_main = About_us.objects.filter(is_hidden=False).first()
        if about_us_main:
            preimushestva = about_us_main.rel_about_advantage.filter(is_hidden=False)[:SIZE_INDEX]
        hit_product_list = House.objects.filter(is_home=True, is_hidden=False).order_by('order_number', '-price')[:SIZE_HIT_INDEX]


        index_title_page = get_static_text(request, locals(), INDEX_TITLE_PAGE)
        index_meta_description = get_static_text(request, locals(), INDEX_META_DESCRIPTION)
        index_meta_keywords = get_static_text(request, locals(), INDEX_META_KEYWORDS)
        # s_main_work = get_static_text(request, locals(), 's_main_work')
        # s_main_delivery = get_static_text(request, locals(), 's_main_delivery')
        # s_main_answers = get_static_text(request, locals(), 's_main_answers')

        context = {
            'hit_product_list':hit_product_list,
            'about_us_main':about_us_main,
            'preimushestva':preimushestva,
            # 'spec_list':spec_list,
            # 'news_list':news_list,
            # 'articles_list':articles_list,
            # 'partner_list':partner_list,
            # 'categories_list_links':categories_list_links,
            # 'categories_list_first_three':categories_list_first_three,
            # 'popular_categories':popular_categories,
            'index_title_page':index_title_page,
            'index_meta_description':index_meta_description,
            'index_meta_keywords':index_meta_keywords,
            # 's_main_work':s_main_work,
            # 's_main_delivery':s_main_delivery,
            # 's_main_answers':s_main_answers,
            'is_index':is_index,
            'offers_list_main':offers_list_main,
        }

        return render(request, self.template_name, context)
    


class MenuView(View):

    def get(self, request, menu_slug):
        # Préférer le préchargement des régions
        current_menu = get_object_or_404(MenuCatalog.objects.prefetch_related('region','type_menu'), slug=menu_slug)
        current_filial = get_current_filial(request)

        # Vérifiez si la filiale actuelle est dans les régions du menu
        if current_menu.region.exists() and not current_menu.region.filter(id=current_filial.id).exists():
            raise Http404("This menu is not available for the current filial.")

        services_list = []
        if current_menu.slug == "uslugi":
            services_list = Services.objects.filter(is_hidden=False)

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

        # Fetch House lists based
        product_list = House.objects.filter(is_hidden=False).annotate(material_count=Count('rel_house__material')).only('id', 'name', 'price')



        #get
        material_filter = get_material_filter(product_list)
        floor_filter = get_floor_filter(product_list)


        context = {
            'current_menu': current_menu,
            'product_list':product_list,
            'about_us_list': about_us_list,
            'zadachi_compania': zadachi_compania,
            'princip_raboty': princip_raboty,
            'preimushestva': preimushestva,
            'review_list_all':review_list_all,
            'review_list': review_list,
            'services_list':services_list,
            'material_filter':material_filter,
            'floor_filter':floor_filter,
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
        product_list = House.objects.filter(is_hidden=False)
        # product_list = House.objects.filter(is_hidden=False).annotate(material_count=Count('rel_house__material'))


        # Prepare context data for rendering
        context = {
            'current_menu': current_menu,
            'product_list':product_list,
        }

        # Корректное формирование ответа сервера на запрос If-Modified-Since
        last_modified = request.META.get('HTTP_IF_MODIFIED_SINCE')
        if last_modified and current_menu.updated_at:
            if _if_modified_since(datetime2rfc(current_menu.updated_at), last_modified):
                return HttpResponseNotModified()
        response = render(request, current_menu.type_menu.template, context)
        response['Last-Modified'] = datetime2rfc(current_menu.updated_at)
        return response
    


class ProductView(TemplateView):
    template_name = "catalog/product.html"

    def get(self, request, product_slug):
        product = get_object_or_404(House, slug=product_slug)
        current_menu = product.catalog
        # current_filial = get_current_filial(request)

        # material_with_price_list = PriceHouse.objects.filter(house=product).select_related('material')
        material_with_price_list = (
            PriceHouse.objects
            .filter(house=product)
            .values('material__name','material__slug')  # Group by material name
            .annotate(min_price=Min('price'))  # Get the minimum price for each material name
            .distinct() 
        )

        available_surfaces_list = (
            PriceHouse.objects
            .filter(house=product)
            .only('surface')
            .values_list('surface', flat=True)
            .distinct()
            )

        # str_filter_name = current_menu.name
        # str_filter_name_bread = current_menu.name
        
        # if current_menu.statictext_five:
        #     html_static_text = get_static_text(request, locals(), current_menu.statictext_five.slug)
        # else:
        #     html_static_text = get_static_text(request, locals(), PRODUCT_TEXT_SLUG)
        
        # if current_menu.statictext_nine:
        #     product_meta_keywords = get_static_text(request, locals(), current_menu.statictext_nine.slug)
        # else:
        #     how_to_buy_text = get_static_text(request, locals(), HOW_TO_BUY_TEXT_SLUG)

        # if current_menu.statictext_six:
        #     product_title_page = get_static_text(request, locals(), current_menu.statictext_six.slug)
        # else:
        #     product_title_page = get_static_text(request, locals(), PRODUCT_TITLE_PAGE)
        
        # if current_menu.statictext_seven:
        #     product_meta_description = get_static_text(request, locals(), current_menu.statictext_seven.slug)
        # else:
        #     product_meta_description = get_static_text(request, locals(), PRODUCT_META_DESCRIPTION)
        
        # if current_menu.statictext_eight:
        #     product_meta_keywords = get_static_text(request, locals(), current_menu.statictext_eight.slug)
        # else:
        #     product_meta_keywords = get_static_text(request, locals(), PRODUCT_META_KEYWORDS)

        context = {
            'current_menu':current_menu,
            # 'current_filial':current_filial,
            'product':product,
            'material_with_price_list':material_with_price_list,
            'available_surfaces_list':available_surfaces_list,
            # 'html_static_text':html_static_text,
            # 'product_meta_keywords':product_meta_keywords,
            # 'how_to_buy_text':how_to_buy_text,
            # 'product_title_page':product_title_page,
            # 'product_meta_description':product_meta_description,
            # 'str_filter_name':str_filter_name,
            # 'str_filter_name_bread':str_filter_name_bread,
        }

        return render(request, self.template_name, context)


class GetSurfacesView(View):
    def post(self, request):
        material_slug = request.POST.get('material_slug')
        house_id = request.POST.get('house_id')  

        if not material_slug or not house_id:
            return JsonResponse({'error': 'material slug and house ID are required!'}, status=400)

        # Récupérer le matériau correspondant au slug
        material = get_object_or_404(Material, slug=material_slug)

        available_surfaces = PriceHouse.objects.filter(
            material=material,
            house__id=house_id 
        ).values_list('surface', flat=True).distinct()

        surfaces_html = render_to_string('pages/product/partials/surface_select.html', {
            'available_surfaces': available_surfaces
        })

        return JsonResponse({
            'surfaces_html': surfaces_html,
            'material_name': material.name  # Inclure le nom du matériau dans la réponse
            })

class PriceView(View):
    def post(self, request):
        material_slug = request.POST.get('material_slug')
        surface = request.POST.get('surface')
        
        if not material_slug or not surface:
            return JsonResponse({'error': 'Please select both the material and the surface!'}, status=400)

        price_house = PriceHouse.objects.filter(material__slug=material_slug, surface=surface).first()
            
        if price_house:
            total_price = price_house.price
            

            return JsonResponse({'total_price': total_price})
        else:
            return JsonResponse({'error': 'Цена не найдена!'}, status=404)
        