from django.contrib import admin

from .models import Offers


class OffersAdmin(admin.ModelAdmin):
	list_display = ('name','created_at','updated_at')
	prepopulated_fields = {'slug': ('name',)}


admin.site.register(Offers, OffersAdmin)