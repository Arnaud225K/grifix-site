from django.contrib import admin

from .models import  Material

class MaterialAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}
	search_fields = ('name','slug')
	list_display = ('name', 'slug',)


admin.site.register(Material, MaterialAdmin)
