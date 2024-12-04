import os

from django.db import models
from django.db.models.signals import post_delete, pre_save
from django_ckeditor_5.fields import CKEditor5Field

from filials.models import Filials


class About_us(models.Model):
	order_number = models.IntegerField(verbose_name="Порядковый номер", blank=True, null=True)
	name = models.CharField(max_length=512, verbose_name="Название")
	description = CKEditor5Field(config_name='extends', verbose_name="О компании", blank=True, null=True)
	goal = CKEditor5Field(config_name='extends', verbose_name="Цель компании", blank=True, null=True)
	image_main = models.ImageField(upload_to='uploads/images', verbose_name="Картинка на главной", blank=True, null=True)
	image_1 = models.ImageField(upload_to='uploads/images', verbose_name="Первая картинка", blank=True, null=True)
	image_2 = models.ImageField(upload_to='uploads/images', verbose_name="Вторая картинка", blank=True, null=True)
	is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True)
	created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
	updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
	
	def __str__(self):
		return self.name
	
	class Meta:
		ordering = ["order_number"]
		verbose_name_plural = "О компании"


def delete_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.image_1:
		if os.path.exists(item.image_1.path):
			os.remove(item.image_1.path)
	if item.image_2:
		if os.path.exists(item.image_2.path):
			os.remove(item.image_2.path)
	if item.image_main:
		if os.path.exists(item.image_main.path):
			os.remove(item.image_main.path)


def save_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.id:
		obj = About_us.objects.get(id=item.id)
		if obj.image_1:
			if (not item.image_1) or obj.image_1.path != item.image_1.path:
				if os.path.exists(obj.image_1.path):
					os.remove(obj.image_1.path)
		if obj.image_2:
			if (not item.image_2) or obj.image_2.path != item.image_2.path:
				if os.path.exists(obj.image_2.path):
					os.remove(obj.image_2.path)
		if obj.image_main:
			if (not item.image_main) or obj.image_main.path != item.image_main.path:
				if os.path.exists(obj.image_main.path):
					os.remove(obj.image_main.path)

post_delete.connect(delete_filefield, About_us)
pre_save.connect(save_filefield, About_us)




class Task_company(models.Model):
    order_number = models.FloatField(verbose_name="Порядковый номер", blank=True, null=True)
    about_us = models.ForeignKey(About_us, on_delete=models.CASCADE, blank=True, null=True, related_name="rel_about_task")
    text = models.CharField(max_length=255, verbose_name="Текст", blank=True, null=True)
    is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True, default=False)

    class Meta:
        ordering = ["order_number"]
        verbose_name_plural = 'Задачи'

    def __str__(self):
        return self.text
	

class Principle(models.Model):
    order_number = models.FloatField(verbose_name="Порядковый номер", blank=True, null=True)
    about_us = models.ForeignKey(About_us, on_delete=models.CASCADE, blank=True, null=True, related_name="rel_about_principle")
    text = models.CharField(max_length=255, verbose_name="Текст", blank=True, null=True)
    is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True, default=False)

    class Meta:
        ordering = ["order_number"]
        verbose_name_plural = 'Принципы работы'

    def __str__(self):
        return self.text
	

class Advantage(models.Model):
    order_number = models.FloatField(verbose_name="Порядковый номер", blank=True, null=True)
    about_us = models.ForeignKey(About_us, on_delete=models.CASCADE, blank=True, null=True, related_name="rel_about_advantage")
    icon = models.ImageField(upload_to='uploads/images', verbose_name="Картинка", blank=True, null=True)
    title = models.CharField(max_length=255, verbose_name="Название", null=True, unique=True)
    text = models.CharField(max_length=255, verbose_name="Текст", blank=True, null=True)
    is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True, default=False)

    class Meta:
        ordering = ["order_number"]
        verbose_name_plural = 'Преимущества'

    def __str__(self):
        return self.title
	
def delete_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.image:
		if os.path.exists(item.image.path):
			os.remove(item.image.path)


def save_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.id:
		obj = Advantage.objects.get(id=item.id)
		if obj.image:
			if (not item.image) or obj.image.path != item.image.path:
				if os.path.exists(obj.image.path):
					os.remove(obj.image.path)


post_delete.connect(delete_filefield, Advantage)
pre_save.connect(save_filefield, Advantage)



class Review(models.Model):
    order_number = models.FloatField(verbose_name="Порядковый номер", blank=True, null=True)
    filial = models.ForeignKey(Filials, verbose_name="Филиал", blank=True, null=True, related_name="rel_review_filial", on_delete=models.CASCADE)
    title = models.CharField(max_length=255, verbose_name="Название")
    video = models.FileField(upload_to='videos/', verbose_name="Видео")
    is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    def __str__(self):
        return self.title

    class Meta:
        ordering = ["order_number"]
        verbose_name_plural = "Отзывы"
		

def delete_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.video:
		if os.path.exists(item.video.path):
			os.remove(item.video.path)


def save_filefield(**kwargs):
	item = kwargs.get('instance')
	if item.id:
		obj = Review.objects.get(id=item.id)
		if obj.video:
			if (not item.video) or obj.video.path != item.video.path:
				if os.path.exists(obj.video.path):
					os.remove(obj.video.path)


post_delete.connect(delete_filefield, Review)
pre_save.connect(save_filefield, Review)