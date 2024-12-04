import os

from django.db import models
from django.db.models.signals import post_delete, pre_save


class ImportImage(models.Model):
	image = models.FileField(upload_to='uploads/import_images', verbose_name="Картинка")
	
	def __str__(self):
		return self.image.url
	
	def url(self):
		return self.image.url
	
	def name(self):
		return os.path.basename(self.image.url)
	
	class Meta:
		ordering = ["-id"]
		verbose_name_plural = "Импорт изображений"


def delete_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.image:
		if os.path.exists(item.image.path):
			os.remove(item.image.path)


def save_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.id:
		obj = ImportImage.objects.get(id=item.id)
		if obj.image:
			if (not item.image) or obj.image.path != item.image.path:
				if os.path.exists(obj.image.path):
					os.remove(obj.image.path)


post_delete.connect(delete_filefield, ImportImage)
pre_save.connect(save_filefield, ImportImage)
