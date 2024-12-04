import math

from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.views.generic.base import TemplateView
from menu.models import MenuCatalog

from .models import Offers

MAX_ITEM_OFFERS = 10

class OffersView(TemplateView):
    """
    Класс для отображения главной страницы Ацкии
    """
    template_name = "special-offers/special-offers.html" 

    def get(self, request, *args, **kwargs):
        current_menu = get_object_or_404(MenuCatalog, slug='spec')
        offers_list = Offers.objects.filter(is_hidden=False)[:MAX_ITEM_OFFERS]
        
        context = {
            'current_menu': current_menu,
            'offers_list': offers_list,
        }
        
        return self.render_to_response(context)



# class OffersItemView(TemplateView):
#     """
#     Класс для отображеия главной страницы Ацкии
#     """
#     template_name = "special-offers/special-offers.html"
    
#     def get(self, request, slug):
        
#         current_menu = get_object_or_404(MenuCatalog, slug='spec')
#         offers_item = get_object_or_404(Offers, slug=slug)
#         offers_list = Offers.objects.filter(is_hidden=False)
        
#         context = {
#             'offers_item': offers_item,
#             'current_menu': current_menu,
#             'offers_list': offers_list,
#         }
        
#         return render(request, self.template_name, context)
