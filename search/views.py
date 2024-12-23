from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.db.models import Q
from django.urls import reverse
from django.db.models import Count
from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from filials.views import get_current_filial
from menu.models import House, MenuCatalog
from .models import SearchTerm, SearchChange

from django.template.loader import render_to_string
from django.http import JsonResponse


COUNT_ITEM_PAGE = 3


class SearchView(TemplateView):
    template_name = "search/results.html"

    def get(self, request):
        search_text = request.GET.get('search', '')
        current_url_search = f"{reverse('search:results')}?search={search_text.replace(' ', '+')}"
        
        # Handle AJAX requests for pagination
        page_number = request.GET.get('page', 1)
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

        # Log search term if it's not an AJAX request
        if not page_number:
            self.log_search_term(search_text, request)

        words = _prepare_words(search_text)
        search_filter = self.build_search_filter(words)

        #Fetch products based on filters
        product_list = House.objects.filter(search_filter, is_hidden=False, catalog__is_hidden=False).only('name', 'slug')
        
        # # Prepare category list based on filtered products
        # category_list = product_list.values('catalog', 'catalog__slug', 'catalog__name').distinct()
        
        # # Exclude found categories from new category list
        # excluded_category_ids = category_list.values_list('catalog', flat=True)
        # category_list_new = MenuCatalog.objects.filter(search_filter, is_hidden=False).exclude(id__in=excluded_category_ids).only('name', 'slug')
        
        paginator = Paginator(product_list, COUNT_ITEM_PAGE)  # Adjust as needed
        page_obj = paginator.get_page(page_number)

        # Prepare context for rendering including available filters:
        context = {
            'search_text': search_text,
            'product_list': page_obj,
            # 'category_list':category_list,
            # 'category_list_new': category_list_new,
            'current_url_search': current_url_search,
            'product_list_count': product_list.count(),
            # 'category_count': category_list.count(),
            # 'has_next': page_obj.has_next(),
            # 'current_page': page_number,
        }

        # If it's an AJAX request, return JSON response
        # if is_ajax:
        #     try:
        #         html_list = render_to_string('pages/search-listing/p-search-listing-partial.html', context)
        #         return JsonResponse({
        #             'html_list': html_list,
        #             'has_next': page_obj.has_next(),
        #             'current_page': page_number,
        #         })
        #     except Exception as e:
        #         return JsonResponse({'error': str(e)}, status=500)  # Renvoie un message d'erreur

        return render(request, self.template_name, context)

    def log_search_term(self, search_text, request):
        current_filial = get_current_filial(request)
        SearchTerm.objects.create(
            q=search_text,
            filial_name=current_filial.name,
            subdomain_name=current_filial.subdomain_name,
            ip_address=request.META.get('REMOTE_ADDR')
        )

    def build_search_filter(self, words):
        search_filter = Q()
        for word in words:
            word = word.replace(',', '.')
            synonyms = SearchChange.objects.filter(source=word).values_list('result', flat=True)
            search_filter |= Q(name__icontains=word) | Q(name__in=synonyms)
        
        return search_filter

def _prepare_words(search_text):
    STRIP_WORDS = {'a', 'an', 'and', 'by', 'for', 'from', 'in', 'no', 
                'not','of','on','or','that','the','to','with'}
    return [word for word in search_text.split() if word not in STRIP_WORDS][:15]