from django.http import JsonResponse
from django.views import View
from django.shortcuts import render, redirect
from django.template.loader import render_to_string

from django.shortcuts import get_object_or_404
from menu.models import House
import json
from django.db.models import Count
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


MAX_COUNT_HOUSES = 20
# from django.views.decorators.csrf import csrf_protect

    
class FavoritesPageView(View):
    def get(self, request,):
        
        favorite_ids = request.session.get('favorites', [])

        # Assurez-vous que favorite_ids est une liste
        if not isinstance(favorite_ids, list):
            favorite_ids = []

        # Récupérer les maisons favorites depuis la base de données
        product_list = House.objects.filter(slug__in=favorite_ids)


        is_favorite_page = True


        page_number = int(request.GET.get('fpage', 1))
        paginator = Paginator(product_list, MAX_COUNT_HOUSES)  # Show 10 houses per page
        houses_page = paginator.get_page(page_number)

        context = {
            'is_favorite_page':is_favorite_page,
            # 'product_list':product_list,
            'product_list':houses_page,
            'has_next': houses_page.has_next(),
            'current_page': page_number,
        }

        # Rendre le template avec les maisons favorites
        return render(request, 'favorites/favorites.html',context)

    def post(self, request):
        # print("Received Post request")
        # Handle AJAX requests for loading more favorites
        favorite_ids = request.session.get('favorites', [])

        if not isinstance(favorite_ids, list):
            favorite_ids = []

        product_list = House.objects.filter(slug__in=favorite_ids)

        # Pagination logic for AJAX requests
        page_number = int(request.POST.get('fpage', 1))  # Get current page number from POST data
        paginator = Paginator(product_list, MAX_COUNT_HOUSES)  # Show 10 houses per page
        houses_page = paginator.get_page(page_number)

        # Prepare response data for AJAX request
        html_favoris_page = render_to_string('pages/favorites/partials/partial-favorites.html', {'product_list': houses_page})

        return JsonResponse({
            'html_favoris_page': html_favoris_page,
            'has_next': houses_page.has_next(),  # Check if there are more pages
            'current_page': page_number,
        })

    

class ManageFavorites(View):
    def post(self, request):
        house_id = request.POST.get('house_id')  
        action = request.POST.get('action')  

        if 'favorites' not in request.session:
            request.session['favorites'] = []

        favorites = request.session['favorites']

        try:
            house = House.objects.get(slug=house_id)
            # print(f"House details: Name: {house.name}, Price: {house.price}") 

        except House.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Дом не найден.'})

        is_favorite = house_id in favorites  

        if action == 'add':
            if not is_favorite:
                favorites.append(house_id)
                request.session['favorites'] = favorites  
                return JsonResponse({'success': True, 'message': 'Дом добавлен в избранное.', 'is_favorite': True})
            else:
                return JsonResponse({'success': False, 'error': 'Дом уже в избранное.', 'is_favorite': True})

        elif action == 'remove':
            if is_favorite:
                favorites.remove(house_id)
                request.session['favorites'] = favorites  

                product_list = House.objects.filter(slug__in=favorites)
                
                # Renvoyer le template partiel pour la maison retirée
                favorites_list = render_to_string('pages/favorites/partials/partial-favorites.html', {'product_list': product_list})
                
                return JsonResponse({
                    'success': True,
                    'message': 'Maison retirée des favoris.',
                    'is_favorite': False,
                    'favorites_list': favorites_list  # Inclure le HTML du template partiel
                })
            else:
                return JsonResponse({'success': False, 'error': 'La maison n\'est pas dans les favoris.', 'is_favorite': False})

        return JsonResponse({'success': False, 'error': 'Action invalide.'})

class FavoritesStatusView(View):
    def get(self, request):
        # Récupérer les IDs des maisons favorites depuis la session
        favorite_ids = request.session.get('favorites', [])

        # Compter le nombre de maisons favorites
        count = len(favorite_ids)
        
        # Récupérer les maisons favorites depuis la base de données
        houses = House.objects.filter(slug__in=favorite_ids)

        # Créer une liste d'objets avec les informations nécessaires
        favorites_data = [
            {
                'id':house.id,
                'slug': house.slug,
                'name': house.name,
                'price': house.price,
                'is_saved': True  # Indiquer que cette maison est un favori
            }
            for house in houses
        ]
        
        return JsonResponse({'count': count, 'favorites': favorites_data})
        # return JsonResponse(favorites_data, safe=False)