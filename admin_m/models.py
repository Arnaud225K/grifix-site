from django.db import models
from django.urls import reverse


class StateData(models.Model):
	name = models.CharField(verbose_name="Статус", max_length=255)
	
	class Meta:
		verbose_name_plural = " Статус (справочник)"
	
	def __str__(self):
		return self.name


class ImportData(models.Model):
	name = models.CharField(verbose_name="Наименование", max_length=255)
	date = models.DateTimeField(auto_now_add=True)
	user = models.CharField(verbose_name="Пользователь", max_length=256)
	email = models.EmailField(verbose_name="E-mail", max_length=50, default="", blank=True, null=True, editable=False)
	action = models.CharField(verbose_name="Операция", max_length=1024, default="", blank=True, null=True)
	state = models.ForeignKey(StateData, verbose_name="Состояние", on_delete=models.CASCADE)
	result = models.CharField(verbose_name="Результат", max_length=1024, default="", blank=True, null=True)
	result_percent = models.DecimalField(verbose_name="Процент выполнения", max_digits=5, decimal_places=2, default="0",
										 blank=True, null=True)
	info = models.TextField(verbose_name="Информация", default="", blank=True, null=True)
	file = models.FileField(upload_to='import/files', verbose_name="Файл", default="", blank=True, null=True)
	
	class Meta:
		ordering = ["-date"]
		verbose_name_plural = u" Результаты импорта"
	
	def __str__(self):
		return 'Запись #' + str(self.id)
	
	def get_absolute_url(self):
		return reverse('admin_m:import_info', args=(self.id,))


class ExportData(models.Model):
	name = models.CharField(verbose_name="Категория", max_length=255)
	date = models.DateTimeField(auto_now_add=True)
	user = models.CharField(verbose_name="Пользователь", max_length=256)
	email = models.EmailField(verbose_name="E-mail", max_length=50, default="", blank=True, null=True)
	state = models.ForeignKey(StateData, verbose_name="Состояние", on_delete=models.CASCADE)
	result_percent = models.DecimalField(verbose_name="Процент выполнения", max_digits=5, decimal_places=2, default="0", blank=True, null=True)
	result = models.CharField(verbose_name="Результат", max_length=1024, default="", blank=True, null=True)
	info = models.TextField(verbose_name="Информация", default="", blank=True, null=True, editable=False)
	link = models.CharField(verbose_name="Ссылка", max_length=1024, default="", blank=True, null=True)

	class Meta:
		ordering = ["-date"]
		verbose_name_plural = u" Результаты экспорта"

	def __str__(self):
		return 'Запись #' + str(self.id)

	def get_full_link(self):
		return "/media/export/" + self.link

class ImportPriceData(models.Model):
	name = models.CharField(verbose_name="Наименование", max_length=255)
	date = models.DateTimeField(auto_now_add=True)
	user = models.CharField(verbose_name="Пользователь", max_length=256)
	email = models.EmailField(verbose_name="E-mail", max_length=50, default="", blank=True, null=True, editable=False)
	action = models.CharField(verbose_name="Операция", max_length=1024, default="", blank=True, null=True)
	state = models.ForeignKey(StateData, verbose_name="Состояние", on_delete=models.CASCADE)
	result = models.CharField(verbose_name="Результат", max_length=1024, default="", blank=True, null=True)
	result_percent = models.DecimalField(verbose_name="Процент выполнения", max_digits=5, decimal_places=2, default="0",
										 blank=True, null=True)
	info = models.TextField(verbose_name="Информация", default="", blank=True, null=True)
	file = models.FileField(upload_to='import/files', verbose_name="Файл", default="", blank=True, null=True)
	
	class Meta:
		ordering = ["-date"]
		verbose_name_plural = u"Результаты импорта редиректов"
	
	def __str__(self):
		return 'Запись #' + str(self.id)
	
	def get_absolute_url(self):
		return reverse('admin_m:import_price_info', args=(self.id,))

class ExportPriceData(models.Model):
	name = models.CharField(verbose_name="Категория", max_length=255)
	date = models.DateTimeField(auto_now_add=True)
	user = models.CharField(verbose_name="Пользователь", max_length=256)
	email = models.EmailField(verbose_name="E-mail", max_length=50, default="", blank=True, null=True)
	state = models.ForeignKey(StateData, verbose_name="Состояние", on_delete=models.CASCADE)
	result_percent = models.DecimalField(verbose_name="Процент выполнения", max_digits=5, decimal_places=2, default="0", blank=True, null=True)
	result = models.CharField(verbose_name="Результат", max_length=1024, default="", blank=True, null=True)
	info = models.TextField(verbose_name="Информация", default="", blank=True, null=True, editable=False)
	link = models.CharField(verbose_name="Ссылка", max_length=1024, default="", blank=True, null=True)

	class Meta:
		ordering = ["-date"]
		verbose_name_plural = u"Результаты экспорта редиректов"

	def __str__(self):
		return 'Запись #' + str(self.id)

	def get_full_link(self):
		return "/media/export/" + self.link
