import json

from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.template.context_processors import csrf
from django.urls import reverse
from django.contrib import messages


from django.views.generic import TemplateView, View

from grifix.settings import CONTACTS_SESSION_KEY
from filials.views import get_current_filial
from . import cartpy as cart
from .models import Order
# from .cartpy import validate_file


from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import re

# class CartView(TemplateView):
# 	template_name = "cart/cart.html"
	
# 	def get(self, request):
# 		cart_items = cart.get_cart_items(request)
		
# 		return render(request, self.template_name, locals())
	
# 	def post(self, request):
# 		cart.create_order(request, "Корзина", None)
# 		return HttpResponseRedirect(reverse('checkout:receipt'))


# class ReceiptView(View):
# 	template_name = "cart/receipt.html"
	
# 	def get(self, request):
# 		order_number = request.session.get('order_number', '')
# 		if order_number:
# 			order = Order.objects.filter(id=order_number)[0]
# 			order_items = OrderItem.objects.filter(order=order)
# 			del request.session['order_number']
# 		else:
# 			cart_url = reverse('checkout:cart')
# 			return HttpResponseRedirect(cart_url)
		
# 		return render(request, self.template_name, locals())


# class CartCountView(View):
# 	@staticmethod
# 	def get(request):
# 		request.session.set_test_cookie()
# 		cart_item_count = cart.cart_distinct_item_count(request)
# 		cart_items = cart.get_cart_items(request)
# 		current_filial = get_current_filial(request)
# 		phone_xclid = current_filial.phone
# 		email_xclid = current_filial.email


# 		if request.session.get(CONTACTS_SESSION_KEY, '') == 'yclid':
# 			if current_filial.phone_yclid:
# 				phone_xclid = current_filial.phone_yclid
# 			if current_filial.email_yclid:
# 				email_xclid = current_filial.email_yclid
# 		if request.session.get(CONTACTS_SESSION_KEY, '') == 'gclid':
# 			if current_filial.phone_gclid:
# 				phone_xclid = current_filial.phone_gclid
# 			if current_filial.email_gclid:
# 				email_xclid = current_filial.email_gclid

# 		cart_modal_content = render(request, 'cart/cart_modal_block.html', locals()).content.decode()
# 		response_data = {'cart_item_count': cart_item_count,
# 							'cart_modal_content': cart_modal_content,
# 							'csrf_token': str(csrf(request)['csrf_token']),
# 							'phone_xclid': phone_xclid,
# 							'email_xclid': email_xclid,
# 						}
# 		return HttpResponse(json.dumps(response_data), content_type="application/json")


class OrderCallbackView(View):
	type_order = ""
	
	def post(self, request):
		cart.create_order(request, self.type_order, None)
		return HttpResponse(json.dumps({}), content_type="application/json")


class SendFormOrder(View):
    type_order = "Корзина"

    def post(self, request):
        # Handle form data here
        post_type = request.POST.get('type', '')
        if post_type:
            self.type_order = post_type

        # Check for honeypot field
        honeypot_value = request.POST.get('form_input', '')
        if honeypot_value:
            return JsonResponse({'success': False, 'error': 'Honeypot field is filled.'})

        # Validate phone number
        phone_number = request.POST.get('phone', '')
        if phone_number and not self.validate_phone_number(phone_number):
            return JsonResponse({'success': False, 'error': 'Invalid phone number format.'})

        # Validate email
        email = request.POST.get('email', '')
        if email and not self.validate_email_field(email):
            return JsonResponse({'success': False, 'error': 'Invalid email format.'})

        # Check if this is an AJAX request
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

        # cart.create_order(request, self.type_order)


        if is_ajax:
            # save the order to the database
            cart.create_order(request, self.type_order)
            
            # Return JSON response indicating success
            return JsonResponse({
                'success': True,
                'message': 'Order created successfully.'
            })

        # If not AJAX, you can still handle it as needed (optional)
        return JsonResponse({'success': False, 'error': 'Invalid request method.'})

    def validate_phone_number(self, phone_number):
        pattern = re.compile(r'^(?:\+7|8)\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$')
        return bool(pattern.match(phone_number))

    def validate_email_field(self, email):
        try:
            validate_email(email)
            return True
        except ValidationError:
            return False


class SendHouseOrder(View):
    type_order = ""

    def post(self, request):
        # Vérifiez si c'est une requête AJAX
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        if not is_ajax:
            return JsonResponse({'success': False, 'error': 'Invalid request method.'})

        # Traitement des données du formulaire ici...
        post_type = request.POST.get('type', '')
        if post_type:
            self.type_order = post_type

        # Check for honeypot field
        honeypot_value = request.POST.get('form_input', '')
        if honeypot_value:
            return JsonResponse({'success': False, 'error': 'Honeypot field is filled.'})

        # Validation du numéro de téléphone
        phone_number = request.POST.get('phone', '')
        if phone_number and not self.validate_phone_number(phone_number):
            return JsonResponse({'success': False, 'error': 'Invalid phone number format.'})

        # Si tout est bon, créer la commande et retourner une réponse JSON
        try:
            cart.create_order(request, self.type_order)  # Assurez-vous que cette fonction existe et fonctionne correctement
            return JsonResponse({'success': True, 'message': 'Order created successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})  # Gérer les exceptions potentielles

    def validate_phone_number(self, phone_number):
        pattern = re.compile(r'^(?:\+7|8)\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$')
        return bool(pattern.match(phone_number))

# class ClearCartView(View):
#     def post(self, request):
#         cart.empty_cart(request)
#         return HttpResponse(json.dumps({}), content_type="application/json")


# class ThankYouView(View):
# 	def get(self, request):
# 		is_thank_you = True
        
# 		message = "Наши менеджеры свяжутся с вами в ближайшее время для <br> уточнения деталей."

# 		context = {
# 			'is_thank_you': is_thank_you,
# 			'message': message,
# 		}

# 		return render(request, 'catalog/thank-you.html', context)
	

# class GenericErrorView(View):
# 	def get(self, request):
# 		is_generic_error = True
# 		message = "Ваша заявка не была успешной из-за мер безопасности. <br> Пожалуйста, повторите попытку позже."
# 		context = {
# 			'is_generic_error':is_generic_error,
# 			'message':message,
# 		}
# 		return render(request, 'catalog/generic-error.html', context)