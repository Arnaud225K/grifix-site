from django.contrib import admin

from .models import MenuCatalog, TypeMenu, House, PriceHouse


class PriceHouseAdmin(admin.TabularInline):
    model = PriceHouse

class MenuCatalogAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}
	list_display = ('name', 'slug', 'order_number', 'parent', 'type_menu', 'created_at', 'updated_at', 'is_hidden')
	search_fields = ('name','slug')
	list_filter = ('type_menu',)


class HouseCatalogAdmin(admin.ModelAdmin):
	inlines = (PriceHouseAdmin,)
	prepopulated_fields = {'slug': ('name',)}
	list_display = ('id', 'name','slug',)
	search_fields = ('name', 'slug', 'id')
	list_filter = ('is_hidden', 'is_home',)


admin.site.register(MenuCatalog, MenuCatalogAdmin)
admin.site.register(House, HouseCatalogAdmin)
admin.site.register(TypeMenu)
# admin.site.register(PriceHouse)


