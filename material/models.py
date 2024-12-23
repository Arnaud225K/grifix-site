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



class Floor(models.Model):
	number = models.CharField(max_length=10, verbose_name="Этажность", unique=True)
	slug = models.SlugField(max_length=255, verbose_name="Название латинское", blank=True, unique=True)
	
	def __str__(self):
		return self.number
	
	class Meta:
		verbose_name_plural = "Этажность"
		ordering = ["number"]
	
	def set_slug(self):
		self.slug = slugify(translit(self.number.replace('.', '-').replace(',', '-'), "ru", reversed=True))


class Bedroom(models.Model):
	number = models.CharField(max_length=10, verbose_name="Число спален", unique=True)
	slug = models.SlugField(max_length=255, verbose_name="Название латинское", blank=True, unique=True)
	
	def __str__(self):
		return self.number
	
	class Meta:
		verbose_name_plural = "Число спален"
		ordering = ["number"]
	
	def set_slug(self):
		self.slug = slugify(translit(self.number.replace('.', '-').replace(',', '-'), "ru", reversed=True))


class Bathroom(models.Model):
	number = models.CharField(max_length=10, verbose_name="Число санузлов", unique=True)
	slug = models.SlugField(max_length=255, verbose_name="Название латинское", blank=True, unique=True)
	
	def __str__(self):
		return self.number
	
	class Meta:
		verbose_name_plural = "Число санузлов"
		ordering = ["number"]
	
	def set_slug(self):
		self.slug = slugify(translit(self.number.replace('.', '-').replace(',', '-'), "ru", reversed=True))


class AdditionalParam(models.Model):
	name = models.CharField(max_length=255, verbose_name="Название", unique=True)
	slug = models.SlugField(max_length=255, verbose_name="Название латинское", blank=True, unique=True)
	description = CKEditor5Field(config_name='extends', verbose_name="Описание", blank=True, null=True)
	
	def __str__(self):
		return self.name
	
	class Meta:
		verbose_name_plural = "Доп. параметры"
		ordering = ["name"]
	
	def save(self, *args, **kwargs):
		self.name = self.name.strip().capitalize()
		# Generate the slug from the name
		self.set_slug()
		super().save(*args, **kwargs)

	def set_slug(self):
		self.slug = slugify(translit(self.name.replace('.', '-').replace(',', '-'), "ru", reversed=True))