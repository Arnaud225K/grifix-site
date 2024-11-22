from django.shortcuts import render
from .models import Filials




def get_current_filial(request):
	"""
	:param current_host: Хост
	:return:current_filial: Текущий филиал
	 Функция определяет текущий филиал
	"""
	# Определение города по ip
	user_filial = None
	city_ip = None
	host = request.get_host()
	try:
		user_filial = request.session['current_filial_flag']
	except:
		pass
	# анализ поддомена и выбор города
	current_filial = None
	current_filial_ip = None
	filials = Filials.objects.filter(isHidden=False).only('id', 'name', 'subdomain_name', 'is_main', 'comment')
	if filials:
		current_filial = filials.filter(is_main=True).first()
		if not current_filial:
			current_filial = filials.first()
		for item in filials:
			if item.subdomain_name and item.subdomain_name + 'indusite.kz' == host:
				current_filial = item
			if not user_filial:
				if item.name == city_ip:
					current_filial_ip = item
		
		# Если выбран поддомен, то выбор города не работает
		if not current_filial.subdomain_name:
			if (not (user_filial or current_filial_ip)) and filials:
				current_filial_ip = filials.first()
			if not user_filial and current_filial_ip:
				request.session['current_filial_flag'] = current_filial_ip.id
		else:
			current_filial_ip = None
		
		current_filial = Filials.objects.get(id=current_filial.id)
	else:
		current_filial = Filials()
	return current_filial