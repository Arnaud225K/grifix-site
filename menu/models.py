import os

from django.db import models
from django.db.models.signals import post_delete, pre_save, post_save
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field
from transliterate import translit

from filials.views import get_current_filial
from static_text.models import StaticText
from filials.models import Filials
from material.models import Material, Floor, Bathroom, Bedroom, AdditionalParam
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
	parent = models.ForeignKey("self", verbose_name="Родительский пункт", null=True, blank=True, on_delete=models.CASCADE)
	parents = models.ManyToManyField("self", verbose_name="Добавить подкатегории", db_table="MenuCatalog_and_parent_MenuCatalog", related_name="_id", blank=True, symmetrical=False)
	type_menu = models.ForeignKey(TypeMenu, verbose_name="Тип меню", related_name="type_menu", on_delete=models.CASCADE, db_index=True)
	region = models.ManyToManyField(Filials, verbose_name="Регионы", db_table="menucatalog_filials", blank=True, symmetrical=False, db_index=True)
	is_hide_marterial = models.BooleanField(verbose_name="Скрыть Материал", blank=True, default=False)
	image = models.ImageField(upload_to="uploads/images", verbose_name="Картинка", blank=True, null=True)
	description = CKEditor5Field(config_name="extends", verbose_name="Описание", blank=True, null=True)
	flag_footer = models.BooleanField(verbose_name="Отображать в подвале")
	flag_main = models.BooleanField(verbose_name="Отображать на главной", default=False)
	title_main = models.CharField(max_length=512, verbose_name="Заголовок страницы", blank=True, null=True)
	keywords = models.TextField(verbose_name="Ключевые слова (мета)", blank=True, null=True, help_text="Ключевые слова для SEO продвижения (через запятую). Мета тэг - keywords")
	keywords_description = models.TextField(verbose_name="Описание (мета)", blank=True, null=True, help_text="Содержимое мета тэга - description")
	has_child = models.BooleanField(verbose_name="Есть вложенные категории", default=False, editable=False)
	is_hidden_child = models.BooleanField(verbose_name="Скрыть дочерние пункты", default=False)
	is_hidden = models.BooleanField(verbose_name='Скрыть')
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

	def get_absolute_url(self):
		return '/{}/'.format(self.slug)

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


class House(models.Model):
	order_number = models.FloatField(verbose_name="Приоритет (Порядковый номер)", blank=True, null=True)
	name = models.CharField(max_length=1024, verbose_name="Название", db_index=True)
	name_full = models.CharField(max_length=1024, verbose_name="Название ручное", blank=True, null=True)
	slug = models.SlugField(max_length=1024, verbose_name="Название латинское", blank=True, null=True)
	catalog = models.ForeignKey(MenuCatalog, verbose_name="Каталог", related_name='house_catalog_set', on_delete=models.CASCADE, db_index=True)

	floor = models.ForeignKey(Floor, verbose_name="Этажность", related_name="rel_floor", blank=True, null=True, on_delete=models.CASCADE, db_index=True)
	bedroom = models.ForeignKey(Bedroom, verbose_name="Число спален", related_name="rel_bedroom", blank=True, null=True, on_delete=models.CASCADE, db_index=True)
	bathroom = models.ForeignKey(Bathroom, verbose_name="Число санузлов", related_name="rel_bathroom", blank=True, null=True, on_delete=models.CASCADE, db_index=True)
	dop_param = models.ManyToManyField(AdditionalParam, verbose_name="Доп. параметры", db_table='dop_param', related_name='dop_param_id', symmetrical=False, blank=True, db_index=True)

	price = models.DecimalField(max_digits=12, decimal_places=0, default=0, verbose_name="Базовая цена", blank=True, null=True)
	
	image = models.CharField(max_length=256, verbose_name="Картинка основная", blank=True, null=True)
	image_2 = models.CharField(max_length=256, verbose_name="Картинка 2", blank=True, null=True)
	image_3 = models.CharField(max_length=256, verbose_name="Картинка 3", blank=True, null=True)
	image_4 = models.CharField(max_length=256, verbose_name="Картинка 4", blank=True, null=True)
	image_5 = models.CharField(max_length=256, verbose_name="Картинка 5", blank=True, null=True)
	image_6 = models.CharField(max_length=256, verbose_name="Картинка 6", blank=True, null=True)

	description = CKEditor5Field(verbose_name="Описание", blank=True, null=True)
	title_main = models.CharField(max_length=512, verbose_name="Заголовок страницы", blank=True, null=True)
	keywords = models.TextField(verbose_name="Ключевые слова (мета)", blank=True, null=True)
	keywords_description = models.TextField(verbose_name="Описание (мета)", blank=True, null=True)
	is_home = models.BooleanField(verbose_name="Показать на главной для хиты", default=False)
	is_hidden = models.BooleanField(verbose_name="Скрыть", default=False, db_index=True)
	created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
	updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
	
		
	def __str__(self):
		return self.name
	
	class Meta:
		ordering = ["catalog"]
		verbose_name_plural = "Дома"

	def formatted_price(self):
		if self.price is not None:
			return f"{self.price:,.0f}".replace(",", " ")
		return "0"

	def get_absolute_url(self):
		return '/product/{}/'.format(self.slug)
	
	def generate_url(self):
		return '/product/' + self.slug + '/'
	
	def set_slug(self):
		name_tmp = self.name
		if self.floor:
			self.name += " {}".format(self.floor.number)
			name_tmp += "_{}".format(self.floor.number)
		if self.bedroom:
			self.name += " {}".format(self.bedroom.number)
			name_tmp += "_{}".format(self.bedroom.number)
		if self.bathroom:
			self.name += " {}".format(self.bathroom.number)
			name_tmp += "_{}".format(self.bathroom.number)
		
		self.slug = slugify(translit(name_tmp.replace('.', '-').replace(',', '-'), "ru", reversed=True))

	def set_name(self):
		name_tmp = self.name
		if self.floor:
			self.name += "Э {}".format(self.floor.number)
			name_tmp += "_{}".format(self.floor.number)
		if self.bedroom:
			self.name += "Сп {}".format(self.bedroom.number)
			name_tmp += "_{}".format(self.bedroom.number)
		if self.bathroom:
			self.name += "Са {}".format(self.bathroom.number)
			name_tmp += "_{}".format(self.bathroom.number)

	def count_unique_materials(self):
		return PriceHouse.objects.filter(house=self).values('material').distinct().count()

	def count_images(self):
		"""Compter le nombre d'images non nulles à partir de image_4."""
		images = [self.image_3 ,self.image_4, self.image_5, self.image_6]
		return sum(1 for img in images if img)  # Compter les images non nulles

class PriceHouse(models.Model):
	house = models.ForeignKey(House, verbose_name="Дом", related_name="rel_house", blank=True, null=True, on_delete=models.CASCADE, db_index=True)
	material = models.ForeignKey(Material, verbose_name="Материал", related_name="rel_material_price", blank=True, null=True, on_delete=models.CASCADE, db_index=True)
	surface = models.PositiveIntegerField(verbose_name="Площадь дома")
	price = models.DecimalField(max_digits=12, decimal_places=0, default=0, verbose_name="Цена/Материал", blank=True, null=True)

	def __str__(self):
		return f"{self.house.name} - {self.material.name}" 

	class Meta:
		verbose_name_plural = "Цена/Материал"

	def formatted_price(self):
		if self.price is not None:
			return f"{self.price:,.0f}".replace(",", " ")
		return "0"