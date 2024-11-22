from django.db import models

class ProjectSettings(models.Model):
	name = models.CharField(max_length=256, verbose_name="Название компании")
	site_name = models.CharField(max_length=256, verbose_name="Название сайта")
	logo = models.ImageField(upload_to='uploads/images', verbose_name="Логотип", blank=True, null=True)
	title_text_index = models.CharField(max_length=256, verbose_name="Заголовок текста на главной странице", blank=True, null=True)
	
	type_company = models.CharField(max_length=256, verbose_name="Тип компании", blank=True, null=True)
	count_staff = models.CharField(max_length=256, verbose_name="Количество сотрудников", blank=True, null=True)
	start_year = models.CharField(max_length=50, verbose_name="Год основания", blank=True, null=True)
	
	text_head = models.TextField(verbose_name="Блок в head (внизу)", blank=True, null=True)
	text_body = models.TextField(verbose_name="Блок в body (внизу)", blank=True, null=True)
	
	tech_mail_server = models.CharField(max_length=256, verbose_name="Почтовый сервер (для отправки сообщений)")
	tech_email = models.CharField(max_length=256, verbose_name="Почта для отправки сообщений")
	tech_email_pass = models.CharField(max_length=256, verbose_name="Пароль почты для отправки сообщений")
	
	def __str__(self):
		return self.name
	
	class Meta:
		ordering = ["id"]
		verbose_name_plural = "Настройки проекта"


class SocialLink(models.Model):
	icon_name = models.CharField(max_length=128, verbose_name="Название значка (css)", default="")
	name = models.CharField(max_length=1024, verbose_name="Ссылка")
	is_hidden = models.BooleanField(verbose_name="Скрыть", blank=True, default=False)
	project_settings = models.ForeignKey(ProjectSettings, on_delete=models.CASCADE)