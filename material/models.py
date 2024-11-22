from django.db import models
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field
from transliterate import translit


class Material(models.Model):
	name = models.CharField(max_length=255, verbose_name="Название", unique=True)
	slug = models.SlugField(max_length=255, verbose_name="Название латинское", blank=True, unique=True)
	description = CKEditor5Field(config_name='extends', verbose_name="Описание", blank=True, null=True)
	
	def __str__(self):
		return self.name
	
	class Meta:
		verbose_name_plural = "Материал"
		ordering = ["name"]
	
	def set_slug(self):
		self.slug = slugify(translit(self.name.replace('.', '-').replace(',', '-'), "ru", reversed=True))
