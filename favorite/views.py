from django.http import JsonResponse
from django.views import View
from django.shortcuts import render, redirect
from django.template.loader import render_to_string

from django.shortcuts import get_object_or_404
from menu.models import House
import json
from django.db.models import Count
from django.db.models import Q

    
class FavoritesPageView(View):
    def get(self, request):
        
        favorite_ids = request.session.get('favorites', [])

        # Assurez-vous que favorite_ids est une liste
        if not isinstance(favorite_ids, list):
            favorite_ids = []

        # Récupérer les maisons favorites depuis la base de données
        product_list = House.objects.filter(id__in=favorite_ids)


        is_favorite_page = True

        context = {
            'is_favorite_page':is_favorite_page,
            'product_list':product_list,
        }

        # Rendre le template avec les maisons favorites
        return render(request, 'favorites/favorites.html',context)

    

class ManageFavorites(View):
    def post(self, request):
        house_id = request.POST.get('house_id')  
        action = request.POST.get('action')  

        if 'favorites' not in request.session:
            request.session['favorites'] = []

        favorites = request.session['favorites']

        try:
            house = House.objects.get(id=house_id)
            print(f"House details: Name: {house.name}, Price: {house.price}") 

        except House.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Maison non trouvée.'})

        is_favorite = house_id in favorites  

        if action == 'add':
            if not is_favorite:
                favorites.append(house_id)
                request.session['favorites'] = favorites  
                return JsonResponse({'success': True, 'message': 'Maison ajoutée aux favoris.', 'is_favorite': True})
            else:
                return JsonResponse({'success': False, 'error': 'La maison est déjà dans les favoris.', 'is_favorite': True})

        elif action == 'remove':
            if is_favorite:
                favorites.remove(house_id)
                request.session['favorites'] = favorites  
                
                # Vérifiez si c'est le dernier favori
                if not favorites:  # Si la liste des favoris est vide
                    empty_message_html = render_to_string('pages/favorites/partials/empty-favorites.html')
                    return JsonResponse({
                        'success': True,
                        'message': 'Maison retirée des favoris.',
                        'is_favorite': False,
                        'favorites_list': empty_message_html  # Inclure le message pour aucun favori
                    })
                
                # Renvoyer le template partiel pour la maison retirée
                favorites_list = render_to_string('pages/favorites/partials/partial-favorites.html', {'product': house})
                
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
        houses = House.objects.filter(id__in=favorite_ids)

        # Créer une liste d'objets avec les informations nécessaires
        favorites_data = [
            {
                'id': house.id,
                'name': house.name,
                'price': house.price,
                'is_saved': True  # Indiquer que cette maison est un favori
            }
            for house in houses
        ]
        
        return JsonResponse({'count': count, 'favorites': favorites_data})
        # return JsonResponse(favorites_data, safe=False)