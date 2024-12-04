from django.shortcuts import render

from django.template import Context, Template

from grifix.views import global_views
from .models import StaticText
from filials.views import get_current_filial


def get_static_text(request, global_context, slug):
	try:
		global_context.update(global_views(request))
		try:
			current_filial = get_current_filial(request)
			region = slug
			if current_filial.subdomain_name == '/':
				region += '_main'
			else:
				region += '_'
				region += current_filial.subdomain_name[:-1]
			html_static_text = Template(StaticText.objects.get(slug=region).text).render(Context(global_context))
		except:
			html_static_text = Template(StaticText.objects.get(slug=slug).text).render(Context(global_context))
	except:
		html_static_text = ''
	return html_static_text


def static_text(request):
	static_text_list = {}
	for item in list(StaticText.objects.values('slug', 'text').distinct().order_by('slug')):
		static_text_list[item['slug']] = item
	
	
	# try:
	# 	call_back_header = static_text_list['call_back_header']['text']
	# except:
	# 	call_back_header = ""
	# try:
	# 	call_back_order = static_text_list['call_back_order']['text']
	# except:
	# 	call_back_order = ""
	# try:
	# 	get_price_catalog = static_text_list['get_price_catalog']['text']
	# except:
	# 	get_price_catalog = ""
	# try:
	# 	get_price_product = static_text_list['get_price_product']['text']
	# except:
	# 	get_price_product = ""
	# try:
	# 	send_cart = static_text_list['send_cart']['text']
	# except:
	# 	send_cart = ""
	# try:
	# 	add_product_catalog = static_text_list['add_product_catalog']['text']
	# except:
	# 	add_product_catalog = ""
	# try:
	# 	add_product_product = static_text_list['add_product_product']['text']
	# except:
	# 	add_product_product = ""
	# try:
	# 	click_order_cart = static_text_list['click_order_cart']['text']
	# except:
	# 	click_order_cart = ""
	# try:
	# 	consult = static_text_list['consult']['text']
	# except:
	# 	consult = ""
	# try:
	# 	free_order_submit = static_text_list['free_order_submit']['text']
	# except:
	# 	free_order_submit = ""

	# try:
	# 	free_order_click = static_text_list['free_order_click']['text']
	# except:
	# 	free_order_click = ""
	# try:
	# 	click_contacts = static_text_list['click_contacts']['text']
	# except:
	# 	click_contacts = ""
	# try:
	# 	click_review = static_text_list['click_review']['text']
	# except:
	# 	click_review = ""
	# try:
	# 	send_review = static_text_list['send_review']['text']
	# except:
	# 	send_review = ""
	# try:
	# 	counter_404 = static_text_list['counter_404']['text']
	# except:
	# 	counter_404 = ""
	# try:
	# 	send_service_request = static_text_list['send_service_request']['text']
	# except:
	# 	send_service_request = ""
	# try:
	# 	send_contact_page = static_text_list['send_contact_page']['text']
	# except:
	# 	send_contact_page = ""
	# try:
	# 	click_order_catalog = static_text_list['click_order_catalog']['text']
	# except:
	# 	click_order_catalog = ""
	# try:
	# 	click_search_catalog = static_text_list['click_search_catalog']['text']
	# except:
	# 	click_search_catalog = ""
		
	return locals()

