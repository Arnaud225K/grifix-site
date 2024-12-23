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
        # check if request is AJAX
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        
        if not is_ajax:
            return JsonResponse({'success': False, 'error': 'Invalid request method.'})

        post_type = request.POST.get('type', '')
        if post_type:
            self.type_order = post_type

        # Check for honeypot field
        honeypot_value = request.POST.get('form_input', '')
        if honeypot_value:
            return JsonResponse({'success': False, 'error': 'Honeypot field is filled.'})

        # phone number Validation
        phone_number = request.POST.get('phone', '')
        if phone_number and not self.validate_phone_number(phone_number):
            return JsonResponse({'success': False, 'error': 'Invalid phone number format.'})

        try:
            cart.create_order(request, self.type_order)  
            return JsonResponse({'success': True, 'message': 'Order created successfully.'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}) 

    def validate_phone_number(self, phone_number):
        pattern = re.compile(r'^(?:\+7|8)\s?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$')
        return bool(pattern.match(phone_number))
