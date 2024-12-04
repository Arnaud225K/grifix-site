from django.contrib import admin

from .models import  Material, Floor, Bathroom, Bedroom, AdditionalParam

class MaterialAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}
	search_fields = ('name','slug')
	list_display = ('name', 'slug',)

class FloorAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('number',)}
	search_fields = ('number','slug')
	list_display = ('number', 'slug',)

class BedroomAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('number',)}
	search_fields = ('number','slug')
	list_display = ('number', 'slug',)

class BathroomAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('number',)}
	search_fields = ('number','slug')
	list_display = ('number', 'slug',)

class AdditionalParamAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}
	list_display = ('name','slug',)
	search_fields = ('name', 'slug')


admin.site.register(Material, MaterialAdmin)
admin.site.register(Floor, FloorAdmin)
admin.site.register(Bathroom, BathroomAdmin)
admin.site.register(Bedroom, BedroomAdmin)
admin.site.register(AdditionalParam, AdditionalParamAdmin)


