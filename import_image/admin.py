from django.contrib import admin

from .models import ImportImage


class ImportImageAdmin(admin.ModelAdmin):
	search_fields = ('image',)
	list_display = ('name', 'url')


admin.site.register(ImportImage, ImportImageAdmin)