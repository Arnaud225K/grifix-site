import time
import json
import re
from itertools import groupby
from operator import itemgetter

from django.core.cache import cache
from django.views.decorators.cache import cache_page

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils.http import http_date, parse_http_date_safe
from email.utils import formatdate
from django.db.models import Count
from django.db.models import Q
from django.http import HttpResponse, Http404, HttpResponseRedirect, JsonResponse, HttpResponseNotModified, HttpResponsePermanentRedirect

from django.shortcuts import render, get_object_or_404
from django.utils.text import slugify
from django.views.generic.base import TemplateView, View
# from transliterate import translit
from django.urls import reverse

from django.core.exceptions import ValidationError
from django.core.validators import validate_email



from django.template.loader import render_to_string

from django.db.models import FloatField
from django.db.models.functions import Cast

import logging
# Create your views here.

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