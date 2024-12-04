import os
from django.db import models
from django.db.models.signals import post_delete, pre_save
from django_ckeditor_5.fields import CKEditor5Field


class Services(models.Model):
	order_number = models.IntegerField(verbose_name="Порядковый номер", blank=True, null=True)
	name = models.CharField(max_length=512, verbose_name="Название")
	description = CKEditor5Field(config_name='extends', verbose_name="Описание", blank=True, null=True)
	text = CKEditor5Field(config_name='extends', verbose_name="Текст", blank=True, null=True)
	image = models.ImageField(upload_to='uploads/images', verbose_name="Картинка", blank=True, null=True)
	is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True)
	created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
	updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')

	
	def __str__(self):
		return self.name
	
	class Meta:
		ordering = ["order_number"]
		verbose_name_plural = "Услуги"


def delete_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.image:
		if os.path.exists(item.image.path):
			os.remove(item.image.path)


def save_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.id:
		obj = Services.objects.get(id=item.id)
		if obj.image:
			if (not item.image) or obj.image.path != item.image.path:
				if os.path.exists(obj.image.path):
					os.remove(obj.image.path)

post_delete.connect(delete_filefield, Services)
pre_save.connect(save_filefield, Services)
