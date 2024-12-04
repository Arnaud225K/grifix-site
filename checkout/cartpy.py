import datetime
import json
import os
import random
import sys
import smtplib
import requests
from urllib.parse import urlencode as original_urlencode
from email import encoders as Encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from django.core import serializers
from django.shortcuts import get_object_or_404
from transliterate import translit

from filials.views import get_current_filial

from menu.models import House
from project_settings.models import ProjectSettings
from grifix.settings import MEDIA_ROOT, CONTACTS_SESSION_KEY
# from .forms import UploadFileForm
from .models import Order

# not needed yet but we will later
# CART_ID_SESSION_KEY = 'cart_id'


# get the current user's cart id, sets new one if blank
# def _cart_id(request):
# 	if request.session.get(CART_ID_SESSION_KEY, '') == '':
# 		request.session[CART_ID_SESSION_KEY] = _generate_cart_id()
# 	return request.session[CART_ID_SESSION_KEY]


# def _generate_cart_id():
# 	cart_id = ''
# 	characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@  # $%^&*()'
# 	cart_id_length = 50
# 	for y in range(cart_id_length):
# 		cart_id += characters[random.randint(0, len(characters) - 1)]
# 	return cart_id


# return all items from the current user's cart
# def get_cart_items(request):
# 	return CartItem.objects.filter(cart_id=_cart_id(request))


# add an item to the cart
# def add_to_cart(request):
# 	postdata = request.POST.copy()
# 	# quantity = 1
# 	quantity = int(postdata.get('product_qte', 1))  # Default to 1 if 'quantity' is not in POST data
# 	product_in_cart = False
# 	product_slug = postdata.get('product_slug', '')
# 	product = get_object_or_404(Product, slug=product_slug)


	
	
	# cart_products = get_cart_items(request)
	# for cart_item in cart_products:
	# 	if cart_item.product == product:
	# 		cart_item.augment_quantity(quantity)
	# 		product_in_cart = True
	
	# if not product_in_cart:
	# 	ci = CartItem()
	# 	ci.product = product
	# 	ci.quantity = quantity
	# 	ci.cart_id = _cart_id(request)
	# 	ci.save()


# def cart_distinct_item_count(request):
# 	return get_cart_items(request).count()


# def get_single_item(request, item_id):
# 	return get_object_or_404(CartItem, id=item_id, cart_id=_cart_id(request))


# def update_cart(request):
# 	postdata = request.POST.copy()
# 	item_id = postdata['item_id']
# 	quantity = postdata['quantity']
# 	cart_item = get_single_item(request, item_id)
# 	if cart_item:
# 		if int(quantity) > 0:
# 			cart_item.quantity = int(quantity)
# 			cart_item.save()
# 		else:
# 			remove_from_cart(request)


# def remove_from_cart(request):
# 	postdata = request.POST.copy()
# 	item_id = postdata['item_id']
# 	cart_item = get_single_item(request, item_id)
# 	if cart_item:
# 		cart_item.delete()


# def is_empty(request):
# 	return cart_distinct_item_count(request) == 0


# def empty_cart(request):
# 	user_cart = get_cart_items(request)
# 	user_cart.delete()


def get_today():
	return datetime.datetime.today().strftime("%Y-%m-%d %H:%M")


def create_order(request, type_order=None):
	# current_filial = get_current_filial(request)
	post_data = request.POST.copy()
	order = Order()
	# cart_items = get_cart_items(request)

	order.name = post_data['name']
	order.email = post_data['email']
	order.phone = post_data['phone']
	order.ip_address = request.META.get('REMOTE_ADDR')
	order.type_client = post_data.get('type_client', '')

	if type_order:
		order.type_order = type_order
	else:
		order.type_order = 'Корзина'

	text_order = ""
	try:
		text_order = request.POST['comment'] + "\n"
	except:
		pass


	if order.type_order == 'Заказ дома':
		material_name = post_data.get('material_name', '')
		surface_house = post_data.get('surface_house', '')
		price_house = post_data.get('price_house', '')
		name_house = post_data.get('name_house', '')
		
		text_order += f"Заказ дома: {name_house}\n"
		text_order += f"Материал - {material_name}\n"
		text_order += f"Площадь, м2 - {surface_house}\n"
		text_order += f"Стоимость - {price_house}\n"

	order.text = text_order

	order.save()
	order_number = order.id

	if order_number:
		request.session['order_number'] = order_number

	return order



def task_send_mail_order(order, request):
	current_filial = get_current_filial(request)
	address_to = current_filial.email

	# if request.session.get(CONTACTS_SESSION_KEY, '') == 'yclid':
	# 	if current_filial.email_yclid:
	# 		address_to = current_filial.email_yclid
	# if request.session.get(CONTACTS_SESSION_KEY, '') == 'gclid':
	# 	if current_filial.email_gclid:
	# 		address_to = current_filial.email_gclid

	# if 'Подписка на рассылку' in order.type_order: 
	# 	host = address_to.split('@')[-1]
	# 	address_to = 'collector@{}'.format(host)
	order.email_to = address_to
	order.save()
	order_id = order.id
	# try:
	# 	import threading
	# 	thr = threading.Thread(target=send_mail_order,
	# 						   args=[request, serializers.serialize('json', [order]),
	# 								 address_to, current_filial, order_id])
	# 	thr.setDaemon(True)
	# 	thr.start()
	# except:
	# 	pass


# send_mail_order(serializers.serialize('json', [order]), get_current_filial(request).id)


# def send_client_zayavka(email, order, fio, product=None):
# 	subject = u"Вы оформили заявку на сайте E&R"
# 	if product:
# 		body = u"""Здравствуйте, %s!\nСпасибо за ваш запрос. """ % (fio)
# 		body += u"""В ближайшее время Вам придет информация о цене и наличии продукции %s\n""" % (product)
# 	else:
# 		body = u"""Здравствуйте, %s!\nСпасибо за ваш запрос. В ближайшее время с Вами свяжется наш специалист!\n""" % (
# 			fio)
# 		body += u"""%s\nВозникли вопросы или дополнение? пишите на электронную почту info@industrial.kz""" % (order)
	
# 	# project_settings = ProjectSettings.objects.all().first()
# 	project_settings = False
# 	if project_settings:
# 		address = project_settings.tech_email
# 		msg = MIMEMultipart('alternative')
# 		msg['From'] = project_settings.tech_email
# 		msg['To'] = email
# 		msg['Subject'] = subject
		
# 		part1 = MIMEText(body, 'plain', 'UTF-8')
# 		msg.attach(part1)
# 		send_msg = smtplib.SMTP(project_settings.tech_mail_server, 465)
# 		send_msg.ehlo()
# 		send_msg.esmtp_features["auth"] = "LOGIN PLAIN"
# 		send_msg.debuglevel = 5
# 		send_msg.login(project_settings.tech_email, project_settings.tech_email_pass)
# 		send_msg.sendmail(address, email, msg.as_string())
# 		send_msg.quit()

def send_mail_order(request, order, address_to, current_filial, order_id):
	# from python_bitrix24.python_bitrix24_django import bitrix24Connection
	order = json.loads(order)[0]['fields']
	fio = order["name"]
	phone = order["phone"]
	email = order["email"]
	text = order["text"]
	date = order["date"]
	file_name = order["file"]
	type_order = order["type_order"]
	type_client = order["type_client"]

	# if type_order == "Консультация" or type_order == "Консультация (потребность)":
	# 	source_id = "2"
	# elif type_order == "Запрос цены" or type_order == "Запрос цены (категория)":
	# 	source_id = "1"
	# elif type_order == "Корзина":
	# 	source_id = "3"
	# elif type_order == "Запрос обратного звонка":
	# 	source_id = "CALLBACK"
	# else:
	# 	source_id = "OTHER"
	
	subject = u"""Поступил новый заказ: %s от %s""" % (fio, date)
	body = u"""Заказ от %s\nТип заявки: %s\nФ.И.О: %s \nТелефон %s\nEmail: %s\n%s\n""" % (date, type_order, fio, phone, email, text)
	if type_client:
		body += 'Клиент: {}\n'.format(type_client)

	# order_names = 'Заказ с сайта # ' + str(order_id) + ' (' + str(current_filial.name) + ')'
	# bitrix24Connection.add_lead(
	# 	order_names, {
	# 		'FIELDS[NAME]': fio,
	# 		'FIELDS[PHONE][0][VALUE]': phone,
	# 		'FIELDS[PHONE][0][VALUE_TYPE]': 'WORK',
	# 		'FIELDS[EMAIL][0][VALUE]': email,
	# 		'FIELDS[EMAIL][0][VALUE_TYPE]': 'WORK',
	# 		'FIELDS[COMMENTS]': text,
	# 		'FIELDS[SOURCE_ID]': source_id,
	# 		'FIELDS[SOURCE_DESCRIPTION]': current_filial.name + ', ' + type_order + ', ' + type_client,
	# 		'FIELDS[UTM_CAMPAIGN]': request.session.get('bt_utm_campaign', ''),
	# 		'FIELDS[UTM_CONTENT]': request.session.get('bt_utm_content', ''),
	# 		'FIELDS[UTM_MEDIUM]': request.session.get('bt_utm_medium', ''),
	# 		'FIELDS[UTM_SOURCE]': request.session.get('bt_utm_source', ''),
	# 		'FIELDS[UTM_TERM]': request.session.get('bt_utm_term', ''),
	# 		# 'FIELDS[UF_CRM_1675925698]': roistat_visit,
	# 		'FIELDS[ASSIGNED_BY_ID]': '76'
	# 	}
	# )


	project_settings = ProjectSettings.objects.all().first()
	
	if project_settings:
		address = project_settings.tech_email
		msg = MIMEMultipart('alternative')
		msg['From'] = project_settings.tech_email
		msg['To'] = address_to
		msg['Subject'] = subject
		
		part1 = MIMEText(body, 'plain', 'UTF-8')
		msg.attach(part1)
		if file_name:
			part = MIMEBase('application', "octet-stream")
			part.set_payload(open(MEDIA_ROOT + file_name, "rb").read())
			Encoders.encode_base64(part)
			part.add_header('Content-Disposition',
							'attachment; filename="%s"' % os.path.basename(MEDIA_ROOT + file_name))
			msg.attach(part)
		
		send_msg = smtplib.SMTP(project_settings.tech_mail_server, 465)
		send_msg.ehlo()
		send_msg.esmtp_features["auth"] = "LOGIN PLAIN"
		send_msg.debuglevel = 5
		send_msg.login(project_settings.tech_email, project_settings.tech_email_pass)
		send_msg.sendmail(address, address_to, msg.as_string())
		send_msg.quit()
	# try:
	# 	if email:
	# 		send_client_zayavka(email, text, fio)
	# except:
	# 	pass
