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
from material.models import Material, Floor, Bathroom, Bedroom, AdditionalParam

from offers.models import Offers
from services.models import Services

from django.template.loader import render_to_string

from django.db.models import FloatField
from django.db.models.functions import Cast
from django.db.models import Min, Max



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

MAX_COUNT_HOUSES = 3

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


def get_material_filter(product_list=None):
    if product_list is None:
        return []
    # Prefetch related materials through PriceHouse
    materials = (
        Material.objects
        .filter(rel_material_price__house__in=product_list)
        .distinct()
        .values('name', 'slug')
    )
    return list(materials)


def get_floor_filter(product_list=None):
    return (
        product_list
        .select_related('rel_floor')
        .values('floor__number', 'floor__slug')
        .exclude(floor__number=None)
        .exclude(floor__slug=None) 
        .order_by('floor__number')
        .annotate(dcount_floor=Count('floor'))
        .distinct()
    )

def get_bedroom_filter(product_list=None):
    return (
        product_list
        .select_related('rel_bedroom')
        .values('bedroom__number', 'bedroom__slug')
        .exclude(bedroom__number=None)
        .exclude(bedroom__slug=None) 
        .order_by('bedroom__number')
        .annotate(dcount_bedroom=Count('bedroom'))
        .distinct()
    )

def get_bathroom_filter(product_list=None):
    return (
        product_list
        .select_related('rel_bathroom')
        .values('bathroom__number', 'bedroom__slug')
        .exclude(bathroom__number=None)
        .exclude(bedroom__slug=None) 
        .order_by('bathroom__number')
        .annotate(dcount_bathroom=Count('bathroom'))
        .distinct()
    )

def get_dop_filter(product_list=None):
    return (
        product_list
        .select_related('dop_param_id')
        .values('dop_param__name', 'dop_param__slug')
        .exclude(dop_param__name=None)
        .exclude(dop_param__slug=None) 
        .order_by('dop_param__name')
        .annotate(dcount_dop_param=Count('dop_param'))
        .distinct()
    )


def get_price_range(queryset):
    """Calculate min and max price from the given queryset."""
    min_price = queryset.aggregate(Min('price'))['price__min'] or 0
    max_price = queryset.aggregate(Max('price'))['price__max'] or 10000000  # Set a default max price
    return min_price, max_price

def format_price(price):
    """Format the price with spaces as thousand separators."""
    return f"{price:,.0f}".replace(",", " ") if price is not None else "0"

# def get_sort_type(sort_type, product_list):
#     sort_type_str = ""

#     # Annotate the product list with float versions of the price fields for sorting
#     product_list = product_list.annotate(
#         price_float=Cast('price', FloatField()),
#     )

#     # Dictionary mapping sort types to order_by clauses
#     sort_options = {
#         '1': ('price_float', 'По цене (дешевые)'),
#         '2': ('-price_float', 'По цене (дорогие)'),
#     }

#     # Get the sort key and description based on sort_type
#     if sort_type in sort_options:
#         order_by_fields, sort_type_str = sort_options[sort_type][:-1], sort_options[sort_type][-1]
#         product_list = product_list.order_by(*order_by_fields)

#     return sort_type_str, product_list

def get_sort_type(sort_type, product_list):
    sort_type_str = ""
    if sort_type == '1':
        product_list = product_list.order_by('name')
        sort_type_str = 'По имени (А-Я)'
    elif sort_type == '2':
        product_list = product_list.order_by('-name')
        sort_type_str = 'По имени (Я-А)'
    elif sort_type == '3':
        product_list = product_list.order_by('price')
        sort_type_str = 'По цене (дешевые)'
    elif sort_type == '4':
        product_list = product_list.order_by('-price')
        sort_type_str = 'По цене (дорогие)'
    elif sort_type == '5':
        product_list = product_list.order_by('order_number', '-price')
        sort_type_str = 'По заданным'
    return sort_type_str, product_list

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
    


class GetFilterUrl(View):
    """ Class to handle requests for generating URL with selected filters. """

    def post(self, request):
        # print("Received POST request")  # Debugging output

        # Extract filter parameters from the request
        post_data = request.POST.copy()
        menu_slug = post_data.get('menu_slug')

        if not menu_slug:
            return JsonResponse({'error': 'Missing menu_slug parameter'}, status=400)

        # Extract other filter parameters
        material_slugs = post_data.getlist('material')
        floor_slugs = post_data.getlist('floor')
        bedroom_slugs = post_data.getlist('bedroom')
        bathroom_slugs = post_data.getlist('bathroom')
        dop_param_slugs = post_data.getlist('dop_param')

        # Extract price parameters
        price_min = post_data.get('price_min')
        price_max = post_data.get('price_max')

        # Extract sort type
        # sort_type = post_data.get('sort_type', '2')
        # sort_type = post_data.get('sort_type')

        try:
            sort_type = post_data.GET['sort_type']
        except:
            sort_type = "5"
 

        try:
            current_menu = MenuCatalog.objects.get(slug=menu_slug)

            # Constructing the new URL based on selected filters
            new_url = f"/{current_menu.slug}/"


            if material_slugs and material_slugs[0] != "":  # Check if materials are selected and not "Все"
                new_url += 'mat__' + '__'.join(material_slugs) + '/'
            if floor_slugs:
                new_url += 'etazh__' + '__'.join(floor_slugs) + '/'
            if bedroom_slugs:
                new_url += 'spal__' + '__'.join(bedroom_slugs) + '/'
            if bathroom_slugs:
                new_url += 'sanuzl__' + '__'.join(bathroom_slugs) + '/'
            if dop_param_slugs:
                new_url += 'dop__' + '__'.join(dop_param_slugs) + '/'

            # Construct Q objects for filtering products
            q_filters = Q(catalog=current_menu, is_hidden=False)

            # Fetch related materials and floor names efficiently using select_related
            product_list = House.objects.select_related('rel_floor', 'rel_bedroom', 'rel_bathroom', 'dop_param').filter(q_filters)


            # Only apply material filters if they are not empty (i.e., not "Все")
            if material_slugs and material_slugs[0] != "":
                price_house_filters = Q()
                price_house_filters &= Q(material__slug__in=material_slugs)
                
                # Get house IDs that match the material filters
                house_ids = PriceHouse.objects.filter(price_house_filters).values_list('house_id', flat=True)
                
                # Step 2: Filter houses using the retrieved IDs
                q_filters &= Q(id__in=house_ids)
            if floor_slugs:
                q_filters &= Q(floor__slug__in=floor_slugs)
            if bedroom_slugs:
                q_filters &= Q(bedroom__slug__in=bedroom_slugs)
            if bathroom_slugs:
                q_filters &= Q(bathroom__slug__in=bathroom_slugs)
            if dop_param_slugs:
                q_filters &= Q(dop_param__slug__in=dop_param_slugs)


            # Apply price filters if provided
            if price_min is not None and price_min != '':
                try:
                    price_min_value = float(price_min)
                    q_filters &= Q(price__gte=price_min_value)  # Greater than or equal to min price
                except ValueError:
                    return JsonResponse({'error': 'Invalid min price value.'}, status=400)

            if price_max is not None and price_max != '':
                try:
                    price_max_value = float(price_max)
                    q_filters &= Q(price__lte=price_max_value)  # Less than or equal to max price
                except ValueError:
                    return JsonResponse({'error': 'Invalid max price value.'}, status=400)
                
            # Apply combined filters to the product list and paginate results
            product_list = House.objects.filter(q_filters)

            # Fetch product list with applied filters
            # product_list = product_list.annotate(
            #     price_float=Cast('price', FloatField())  # Annotate with float version of price for sorting
            # )

            # Sort product list based on sort type
            # if sort_type == '1':
            #     product_list = product_list.order_by('price')  # Ascending order
            # elif sort_type == '2':
            #     product_list = product_list.order_by('-price')  # Descending order

            if sort_type:
                sort_type_str, product_list = get_sort_type(sort_type, product_list)

            # Paginate results
            page_number = int(post_data.get('page', 1))
            paginator = Paginator(product_list, MAX_COUNT_HOUSES)  # Show 10 houses per page
            houses_page = paginator.get_page(page_number)


            # Prepare context for rendering including available filters:
            context = {
                'current_menu': current_menu,
                'product_list': houses_page,
            }

            return JsonResponse({
                'url': new_url,
                'html_block': render_to_string('pages/product-listing/partial/p-product-listing-partial.html', context),
                'has_next': houses_page.has_next(),
                'current_page': page_number,
            })

        except MenuCatalog.DoesNotExist:
            return JsonResponse({'error': 'Menu not found.'}, status=404)
        except Exception as e:
            # print(f"An error occurred: {str(e)}")  # Debugging output for unexpected errors
            return JsonResponse({'error': str(e)}, status=500)



class MenuView(View):

    def get(self, request, menu_slug):

        # Extract sort type
        # sort_type = request.GET.get('sort_type')  # Default sorting type
        try:
            sort_type = request.GET['sort_type']
        except:
            sort_type = "5"

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
        product_list = House.objects.filter(is_hidden=False)
        # material_count = product_list.count_unique_materials()

        # Fetch product list with applied filters
        # product_list = product_list.annotate(
        #     price_float=Cast('price', FloatField())  # Annotate with float version of price for sorting
        # )

        # Sort product list based on sort type
        # if sort_type == '1':
        #     product_list = product_list.order_by('price')  # Ascending order
        # elif sort_type == '2':
        #     product_list = product_list.order_by('-price')  # Descending order


        if sort_type:
            sort_type_str, product_list = get_sort_type(sort_type, product_list)




        #get
        material_filter = get_material_filter(product_list)
        floor_filter = get_floor_filter(product_list)
        bedroom_filter = get_bedroom_filter(product_list)
        bathroom_filter = get_bathroom_filter(product_list)
        dop_param_filter = get_dop_filter(product_list)

        # Calculate min and max price using the new function
        min_price, max_price = get_price_range(product_list)


        page_number = int(request.GET.get('page', 1))
        paginator = Paginator(product_list, MAX_COUNT_HOUSES)  # Show 10 houses per page
        houses_page = paginator.get_page(page_number)
        
        context = {
            'current_menu': current_menu,
            'product_list':houses_page,
            'has_next': houses_page.has_next(),
            'current_page': page_number,
            'about_us_list': about_us_list,
            'zadachi_compania': zadachi_compania,
            'princip_raboty': princip_raboty,
            'preimushestva': preimushestva,
            'review_list_all':review_list_all,
            'review_list': review_list,
            'services_list':services_list,
            'material_filter':material_filter,
            'floor_filter':floor_filter,
            'bedroom_filter':bedroom_filter,
            'bathroom_filter':bathroom_filter,
            'dop_param_filter':dop_param_filter,
            'min_price': min_price,
            'max_price': max_price, 
        }

        return render(request, current_menu.type_menu.template, context)

        # Gestion de If-Modified-Since
        # last_modified = request.META.get('HTTP_IF_MODIFIED_SINCE')
        # if last_modified and current_menu.updated_at:
        #     if _if_modified_since(datetime2rfc(current_menu.updated_at), last_modified):
        #         return HttpResponseNotModified()

        # response = render(request, current_menu.type_menu.template, context)
        # response['Last-Modified'] = datetime2rfc(current_menu.updated_at)
        
        # return response

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

        # sort_type = request.GET.get('sort_type')  # Default sorting type
        try:
            sort_type = request.GET['sort_type']
        except:
            sort_type = "5"

        # Check if the menu exists
        current_menu = get_object_or_404(MenuCatalog, slug=menu_slug, is_hidden=False)

        # Initialize filter lists
        filters = {
            'mat': [],
            'etazh':[],
            'spal':[],
            'sanuzl':[],
            'dop':[],
        } 

        # Parse filters from the URL
        path_parts = request.path.split('/')

        # Define valid prefixes
        valid_prefixes = {'mat', 'etazh', 'spal', 'sanuzl', 'dop'}

        # Skip the first part (menu_slug) and validate remaining parts
        for part in path_parts[2:]:  # Start from index 2 to skip menu_slug and empty parts
            if not part:  # Skip empty parts
                continue
            
            prefix, *values = part.split('__')
            if prefix in valid_prefixes:
                filters[prefix].extend(values)
            else:
                print(f"Invalid filter prefix detected: {prefix}")  # Debugging log
                raise Http404("Invalid filter prefix in the URL.")

        if not any(filters.values()):  # If no valid filters were found
            raise Http404("No valid filter prefix found in the URL.")

        # Validate filter slugs against the database
        self.validate_filters(filters)

        # Build Q objects for filtering products
        q_filters = Q(catalog=current_menu, is_hidden=False)                

        # Add filters to Q objects based on validated filters
        # Adjust filtering logic to use PriceHouse for materials
        if filters['mat']:
            q_filters &= Q(rel_house__material__slug__in=filters['mat'])  # Use related name
        
        if filters['etazh']:
            q_filters &= Q(floor__slug__in=filters['etazh'])

        if filters['spal']:
            q_filters &= Q(bedroom__slug__in=filters['spal'])

        if filters['sanuzl']:
            q_filters &= Q(bathroom__slug__in=filters['sanuzl'])

        if filters['dop']:
            q_filters &= Q(dop_param__slug__in=filters['dop'])
        

        # marka_filter = self.get_available_filters(product_list, 'marka')
        # standart_filter = self.get_available_filters(product_list, 'standart')
        
        # product_list = House.objects.filter(is_hidden=False)
        product_list = House.objects.filter(q_filters)

        product_list_filter = House.objects.filter(is_hidden=False)


        material_filter = get_material_filter(product_list_filter)
        floor_filter = get_floor_filter(product_list_filter)
        bedroom_filter = get_bedroom_filter(product_list_filter)
        bathroom_filter = get_bathroom_filter(product_list_filter)
        dop_param_filter = get_dop_filter(product_list_filter)

        # Calculate min and max price using the new function
        min_price, max_price = get_price_range(product_list)


        # Fetch product list with applied filters
        # product_list = product_list.annotate(
        #     price_float=Cast('price', FloatField())  # Annotate with float version of price for sorting
        # )

        # Sort product list based on sort type
        # if sort_type == '1':
        #     product_list = product_list.order_by('price')  # Ascending order
        # elif sort_type == '2':
        #     product_list = product_list.order_by('-price')  # Descending order

        if sort_type:
            sort_type_str, product_list = get_sort_type(sort_type, product_list)


        page_number = int(request.GET.get('page', 1))
        paginator = Paginator(product_list, MAX_COUNT_HOUSES)  # Show 10 houses per page
        houses_page = paginator.get_page(page_number)

        # Prepare context data for rendering
        context = {
            'current_menu': current_menu,
            # 'product_list':product_list,
            'product_list':houses_page,
            'has_next': houses_page.has_next(),
            'current_page': page_number,
            'selected_filters': json.dumps(filters),  # Serialize as JSON string
            # 'filters': filters,
            'material_filter':material_filter,
            'floor_filter':floor_filter,
            'bedroom_filter':bedroom_filter,
            'bathroom_filter':bathroom_filter,
            'dop_param_filter':dop_param_filter,
            'min_price': min_price,
            'max_price': max_price, 
        }

        return render(request, current_menu.type_menu.template, context)


    def validate_filters(self, filters):
        """ Validate that all filter slugs exist in the database. """

        # Validate Material Slugs
        if filters['mat']:
            existing_mat = set(Material.objects.filter(slug__in=filters['mat']).values_list('slug', flat=True))
            invalid_mat = set(filters['mat']) - existing_mat
            if invalid_mat:
                print(f"Invalid material slug(s): {invalid_mat}")  # Debugging log
                raise Http404(f"Invalid material slug(s): {', '.join(invalid_mat)}")

        # Validate Floor Slugs
        if filters['etazh']:
            existing_floors = set(Floor.objects.filter(slug__in=filters['etazh']).values_list('slug', flat=True))
            invalid_floors = set(filters['etazh']) - existing_floors
            if invalid_floors:
                print(f"Invalid floor slug(s): {invalid_floors}")  # Debugging log
                raise Http404(f"Invalid floor slug(s): {', '.join(invalid_floors)}")

        # Validate Bedroom Slugs
        if filters['spal']:
            existing_bedrooms = set(Bedroom.objects.filter(slug__in=filters['spal']).values_list('slug', flat=True))
            invalid_bedrooms = set(filters['spal']) - existing_bedrooms
            if invalid_bedrooms:
                print(f"Invalid bedroom slug(s): {invalid_bedrooms}")  # Debugging log
                raise Http404(f"Invalid bedroom slug(s): {', '.join(invalid_bedrooms)}")

        # Validate Bathroom Slugs
        if filters['sanuzl']:
            existing_bathrooms = set(Bathroom.objects.filter(slug__in=filters['sanuzl']).values_list('slug', flat=True))
            invalid_bathrooms = set(filters['sanuzl']) - existing_bathrooms
            if invalid_bathrooms:
                print(f"Invalid bathroom slug(s): {invalid_bathrooms}")  # Debugging log
                raise Http404(f"Invalid bathroom slug(s): {', '.join(invalid_bathrooms)}")

        # Validate Additional Parameter Slugs
        if filters['dop']:
            existing_dop_params = set(AdditionalParam.objects.filter(slug__in=filters['dop']).values_list('slug', flat=True))
            invalid_dop_params = set(filters['dop']) - existing_dop_params
            if invalid_dop_params:
                print(f"Invalid additional parameter slug(s): {invalid_dop_params}")  # Debugging log
                raise Http404(f"Invalid additional parameter slug(s): {', '.join(invalid_dop_params)}")


    


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

        additional_images_count = product.count_images()

        # print(additional_images_count)


        context = {
            'current_menu':current_menu,
            # 'current_filial':current_filial,
            'product':product,
            'material_with_price_list':material_with_price_list,
            'available_surfaces_list':available_surfaces_list,
            'additional_images_count':additional_images_count,
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
            house__slug=house_id 
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
            total_price = format_price(price_house.price)

            return JsonResponse({'total_price': total_price})
        else:
            return JsonResponse({'error': 'Цена не найдена!'}, status=404)
        