import os

from django.db import models
from django.db.models.signals import post_delete, pre_save
from django_ckeditor_5.fields import CKEditor5Field


class Offers(models.Model):
	order_number = models.IntegerField(verbose_name="Порядковый номер", blank=True, null=True)
	name = models.CharField(max_length=512, verbose_name="Название")
	slug = models.SlugField(max_length=512, verbose_name="Название латинское", blank=True, null=True)
	description = CKEditor5Field(config_name='extends', verbose_name="Описание", blank=True, null=True)
	text = CKEditor5Field(config_name='extends', verbose_name="Текст", blank=True, null=True)
	image = models.ImageField(upload_to='uploads/images', verbose_name="Картинка основная", blank=True, null=True)
	image_2 = models.ImageField(upload_to='uploads/images', verbose_name="Вторая картинка", blank=True, null=True)
	is_show_main = models.BooleanField(verbose_name="Показывать на главной", blank=True, default=False)
	is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True)
	created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
	updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

	
	def __str__(self):
		return self.name
	
	class Meta:
		ordering = ["order_number"]
		verbose_name_plural = "Акции"

	def get_absolute_url(self):
		return '/spec/{}/'.format(self.slug)

def delete_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.image:
		if os.path.exists(item.image.path):
			os.remove(item.image.path)
	if item.image_2:
		if os.path.exists(item.image_2.path):
			os.remove(item.image_2.path)


def save_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.id:
		obj = Offers.objects.get(id=item.id)
		if obj.image:
			if (not item.image) or obj.image.path != item.image.path:
				if os.path.exists(obj.image.path):
					os.remove(obj.image.path)
		if obj.image_2:
			if (not item.image_2) or obj.image_2.path != item.image_2.path:
				if os.path.exists(obj.image_2.path):
					os.remove(obj.image_2.path)

post_delete.connect(delete_filefield, Offers)
pre_save.connect(save_filefield, Offers)
