from django.contrib import admin

from .models import Services


class ServicesAdmin(admin.ModelAdmin):
	list_display = ('name','created_at','updated_at','is_hidden')

admin.site.register(Services, ServicesAdmin)