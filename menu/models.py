import os

from django.db import models
from django.db.models.signals import post_delete, pre_save, post_save
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field
from transliterate import translit

from filials.views import get_current_filial
from static_text.models import StaticText
from filials.models import Filials
from material.models import Material
from django.urls import reverse


class TypeMenu(models.Model):
	name = models.CharField(max_length=256, verbose_name="Название типа")
	template = models.CharField(max_length=1024, verbose_name="Название файла шаблона")
	
	def __str__(self):
		return self.name
	
	class Meta:
		ordering = ["id"]
		verbose_name_plural = "Тип меню"


class MenuCatalog(models.Model):
	name = models.CharField(max_length=255, verbose_name="Название пункта", unique=True)
	name_title = models.CharField(max_length=255, verbose_name="Название (в ед. числе)", blank=True)
	slug = models.SlugField(max_length=255, verbose_name="Название латинское", blank=True, unique=True)
	order_number = models.FloatField(verbose_name="Порядковый номер", blank=True, null=True)
	parent = models.ForeignKey('self', verbose_name="Родительский пункт", null=True, blank=True, on_delete=models.CASCADE)
	parents = models.ManyToManyField('self', verbose_name='Добавить подкатегории', db_table='MenuCatalog_and_parent_MenuCatalog', related_name='_id', blank=True, symmetrical=False)
	type_menu = models.ForeignKey(TypeMenu, verbose_name="Тип меню", related_name='type_menu', on_delete=models.CASCADE)
	region = models.ManyToManyField(Filials, verbose_name='Регионы', db_table='menucatalog_filials', blank=True, symmetrical=False)
	is_hide_marterial = models.BooleanField(verbose_name="Скрыть Материал", blank=True, default=False)
	# is_hide_standart = models.BooleanField(verbose_name="Скрыть ГОСТ", blank=True)
	image = models.ImageField(upload_to='uploads/images', verbose_name="Картинка", blank=True, null=True)
	description = CKEditor5Field(config_name='extends', verbose_name="Описание", blank=True, null=True)
	text_service = models.CharField(max_length=255, verbose_name="Текст для карточки услуги", blank=True, null=True, default="")
	uslugi = models.ManyToManyField('self', verbose_name='Услуги', db_table='MenuCatalog_and_uslugi_MenuCatalog', blank=True)
	flag_footer = models.BooleanField(verbose_name="Отображать в подвале")
	flag_main = models.BooleanField(verbose_name="Отображать на главной", default=False)
	title_main = models.CharField(max_length=512, verbose_name="Заголовок страницы", blank=True, null=True)
	keywords = models.TextField(verbose_name="Ключевые слова (мета)", blank=True, null=True, help_text='Ключевые слова для SEO продвижения (через запятую). Мета тэг - keywords')
	keywords_description = models.TextField(verbose_name="Описание (мета)", blank=True, null=True, help_text='Содержимое мета тэга - description')
	has_child = models.BooleanField(verbose_name="Есть вложенные категории", default=False, editable=False)
	is_hidden_child = models.BooleanField(verbose_name="Скрыть дочерние пункты", default=False)
	is_hidden = models.BooleanField(verbose_name="Скрыть")
	show_footer_left = models.BooleanField(verbose_name="Показывать в подвале (левый столбец)", default=False)
	show_footer_rigth = models.BooleanField(verbose_name="Показывать в подвале (правый столбец)", default=False)
	show_header_menu = models.BooleanField(verbose_name="Показывать в верхнем меню", default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


	def __str__(self):
		return self.name

	class Meta:
		ordering = ["order_number"]
		verbose_name_plural = "Меню/Каталог"

	def get_child(self):
		tmp = MenuCatalog.objects.filter(parent=self, is_hidden=False).only('name', 'slug', 'has_child')
		return tmp

	def get_childs(self):
		tmp = self.parents.all()
		return tmp

	def get_all_children(self):
		children = MenuCatalog.objects.filter(parent=self, is_hidden=False).only('id')
		return children

	def get_child_menu(self):
		tmp = self.parents.filter(is_hidden=False).only('name', 'slug', 'has_child') | MenuCatalog.objects.filter(parent=self, is_hidden=False).only('name', 'slug', 'has_child')
		return tmp


	def get_service_list(self):
		tmp = self.uslugi.all()
		return tmp

	def get_absolute_url(self):
		return '/{}/'.format(self.slug)


# class Product(models.Model):
# 	order_number = models.FloatField(verbose_name="Приоритет (Порядковый номер)", blank=True, null=True)
# 	name = models.CharField(max_length=1024, verbose_name="Название")
# 	name_full = models.CharField(max_length=1024, verbose_name="Название ручное", blank=True, null=True)
# 	slug = models.SlugField(max_length=1024, verbose_name="Название латинское", blank=True, null=True)
# 	catalog = models.ForeignKey(MenuCatalog, verbose_name="Категория металлопроката", related_name='product_catalog_set', on_delete=models.CASCADE)
# 	catalog_two = models.ForeignKey(MenuCatalog, verbose_name="Категория металлопроката акции", related_name='product_catalog_two_set', blank=True, null=True, on_delete=models.CASCADE)

# 	param_1 = models.CharField(max_length=128, verbose_name="Параметр 1", blank=True, null=True, default='')
# 	param_1_slug = models.CharField(max_length=128, verbose_name="Параметр 1 slug", blank=True, null=True, default='')
# 	param_2 = models.CharField(max_length=128, verbose_name="Параметр 2", blank=True, null=True, default='')
# 	param_2_slug = models.CharField(max_length=128, verbose_name="Параметр 2 slug", blank=True, null=True, default='')
# 	param_3 = models.CharField(max_length=128, verbose_name="Параметр 3", blank=True, null=True, default='')
# 	param_3_slug = models.CharField(max_length=128, verbose_name="Параметр 3 slug", blank=True, null=True, default='')
# 	param_4 = models.CharField(max_length=128, verbose_name="Параметр 4", blank=True, null=True, default='')
# 	param_4_slug = models.CharField(max_length=128, verbose_name="Параметр 4 slug", blank=True, null=True, default='')
# 	param_5 = models.CharField(max_length=128, verbose_name="Параметр 5", blank=True, null=True, default='')
# 	param_5_slug = models.CharField(max_length=128, verbose_name="Параметр 5 slug", blank=True, null=True, default='')
# 	param_6 = models.CharField(max_length=128, verbose_name="Параметр 6", blank=True, null=True, default='')
# 	param_6_slug = models.CharField(max_length=128, verbose_name="Параметр 6 slug", blank=True, null=True, default='')
# 	param_7 = models.CharField(max_length=128, verbose_name="Параметр 7", blank=True, null=True, default='')
# 	param_7_slug = models.CharField(max_length=128, verbose_name="Параметр 7 slug", blank=True, null=True, default='')
# 	param_8 = models.CharField(max_length=128, verbose_name="Параметр 8", blank=True, null=True, default='')
# 	param_8_slug = models.CharField(max_length=128, verbose_name="Параметр 8 slug", blank=True, null=True, default='')
	
# 	marka = models.ForeignKey(Marka, verbose_name="Марка", related_name="marka", blank=True, null=True, on_delete=models.CASCADE)
# 	standart = models.ForeignKey(Standart, verbose_name="ГОСТ", related_name="standart", blank=True, null=True, on_delete=models.CASCADE)
# 	is_service = models.BooleanField(verbose_name="Услуга", default=False)
# 	is_manufacture = models.BooleanField(verbose_name="Производство", default=False)
# 	is_spec = models.BooleanField(verbose_name="Спецпредложение", default=False)
# 	available = models.CharField(max_length=128, verbose_name="Наличие", blank=True, null=True)
# 	ed_izm = models.CharField(max_length=128, verbose_name="Единицы измерения", blank=True, null=True)
# 	price = models.CharField(max_length=128, verbose_name="Цена", blank=True, null=True)
# 	image = models.CharField(max_length=256, verbose_name="Картинка основная", blank=True, null=True)
# 	image_2 = models.CharField(max_length=256, verbose_name="Картинка 2", blank=True, null=True)
# 	description = CKEditor5Field(verbose_name="Описание", blank=True, null=True)
# 	description_service = models.CharField(max_length=256, verbose_name="Описание (услуга)", blank=True, null=True)
# 	vendor = models.CharField(max_length=128, verbose_name="Производитель", blank=True, null=True)
# 	vendor_country = models.CharField(max_length=128, verbose_name="Страна производителя", blank=True, null=True)
# 	method_of_manufacture = models.CharField(max_length=128, verbose_name="Способ изготовления", blank=True, null=True)
# 	title_main = models.CharField(max_length=512, verbose_name="Заголовок страницы", blank=True, null=True)
# 	keywords = models.TextField(verbose_name="Ключевые слова (мета)", blank=True, null=True)
# 	keywords_description = models.TextField(verbose_name="Описание (мета)", blank=True, null=True)
# 	is_hidden = models.BooleanField(verbose_name="Скрыть", default=False)
# 	is_home = models.BooleanField(verbose_name="Показать на главной для акций", default=False)
# 	updated_at = models.DateTimeField(auto_now=True)
	
# 	def __str__(self):
# 		return self.name
	
# 	class Meta:
# 		ordering = ["catalog"]
# 		verbose_name_plural = "Продукт"

# 	def get_absolute_url(self):
# 		return '/product/{}/'.format(self.slug)
	
# 	def generate_url(self):
# 		return '/product/' + self.slug + '/'
	
# 	def set_slug(self):
# 		name_tmp = self.name
# 		if self.param_1:
# 			self.name += " {}".format(self.param_1)
# 			name_tmp += "_{}".format(self.param_1)
# 			self.param_1_slug = slugify(translit(self.param_1.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_2:
# 			self.name += " {}".format(self.param_2)
# 			name_tmp += "_{}".format(self.param_2)
# 			self.param_2_slug = slugify(translit(self.param_2.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_3:
# 			self.name += " {}".format(self.param_3)
# 			name_tmp += "_{}".format(self.param_3)
# 			self.param_3_slug = slugify(translit(self.param_3.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_4:
# 			self.name += " {}".format(self.param_4)
# 			name_tmp += "_{}".format(self.param_4)
# 			self.param_4_slug = slugify(translit(self.param_4.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_5:
# 			self.name += " {}".format(self.param_5)
# 			name_tmp += "_{}".format(self.param_5)
# 			self.param_5_slug = slugify(translit(self.param_5.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_6:
# 			self.name += " {}".format(self.param_6)
# 			name_tmp += "_{}".format(self.param_6)
# 			self.param_6_slug = slugify(translit(self.param_6.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_7:
# 			self.name += " {}".format(self.param_7)
# 			name_tmp += "_{}".format(self.param_7)
# 			self.param_7_slug = slugify(translit(self.param_7.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_8:
# 			self.name += " {}".format(self.param_8)
# 			name_tmp += "_{}".format(self.param_8)
# 			self.param_8_slug = slugify(translit(self.param_8.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.marka:
# 			self.name += " {}".format(self.marka.name)
# 			name_tmp += "_{}".format(self.marka.name)
# 		if self.standart:
# 			self.name += " {}".format(self.standart.name)
# 			name_tmp += "_{}".format(self.standart.name)
		
# 		self.slug = slugify(translit(name_tmp.replace('.', '-').replace(',', '-'), "ru", reversed=True))

# 	def set_name(self):
# 		name_tmp = self.name
# 		if self.param_1:
# 			self.name += " {}".format(self.param_1)
# 			name_tmp += "_{}".format(self.param_1)
# 			self.param_1_slug = slugify(translit(self.param_1.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_2:
# 			self.name += " {}".format(self.param_2)
# 			name_tmp += "_{}".format(self.param_2)
# 			self.param_2_slug = slugify(translit(self.param_2.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_3:
# 			self.name += " {}".format(self.param_3)
# 			name_tmp += "_{}".format(self.param_3)
# 			self.param_3_slug = slugify(translit(self.param_3.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_4:
# 			self.name += " {}".format(self.param_4)
# 			name_tmp += "_{}".format(self.param_4)
# 			self.param_4_slug = slugify(translit(self.param_4.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_5:
# 			self.name += " {}".format(self.param_5)
# 			name_tmp += "_{}".format(self.param_5)
# 			self.param_5_slug = slugify(translit(self.param_5.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_6:
# 			self.name += " {}".format(self.param_6)
# 			name_tmp += "_{}".format(self.param_6)
# 			self.param_6_slug = slugify(translit(self.param_6.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_7:
# 			self.name += " {}".format(self.param_7)
# 			name_tmp += "_{}".format(self.param_7)
# 			self.param_7_slug = slugify(translit(self.param_7.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.param_8:
# 			self.name += " {}".format(self.param_8)
# 			name_tmp += "_{}".format(self.param_8)
# 			self.param_8_slug = slugify(translit(self.param_8.replace('.', '-').replace(',', '-'), "ru", reversed=True))
# 		if self.marka:
# 			self.name += " {}".format(self.marka.name)
# 			name_tmp += "_{}".format(self.marka.name)
# 		if self.standart:
# 			self.name += " {}".format(self.standart.name)
# 			name_tmp += "_{}".format(self.standart.name)



def delete_filefield(sender, **kwargs):
	item = kwargs.get('instance')
	if item.image:
		if os.path.exists(item.image.path):
			os.remove(item.image.path)


def save_filefield(sender, **kwargs):
	item = kwargs.get('instance')
	if item.id:
		obj = sender.objects.get(id=item.id)
		if obj.image:
			if (not item.image) or obj.image.path != item.image.path:
				if os.path.exists(obj.image.path):
					os.remove(obj.image.path)

def save_menu_filefield(sender, **kwargs):
	item = kwargs.get('instance')
	if item.parent:
		item.parent.has_child = True
		item.parent.save()


post_delete.connect(delete_filefield, MenuCatalog)
pre_save.connect(save_filefield, MenuCatalog)
post_save.connect(save_menu_filefield, MenuCatalog)