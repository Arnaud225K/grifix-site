from django.contrib import admin

from .models import MenuCatalog, TypeMenu


class MenuCatalogAdmin(admin.ModelAdmin):
	prepopulated_fields = {'slug': ('name',)}
	list_display = ('name', 'slug', 'order_number', 'parent', 'type_menu', 'created_at', 'updated_at', 'is_hidden')
	search_fields = ('name','slug')
	list_filter = ('type_menu',)


# class ProductCatalogAdmin(admin.ModelAdmin):
# 	prepopulated_fields = {'slug': ('name',)}
# 	list_display = ('id', 'name','slug',)
# 	search_fields = ('name', 'slug', 'id')
# 	list_filter = ('is_spec', 'catalog',)


admin.site.register(MenuCatalog, MenuCatalogAdmin)
# admin.site.register(Product, ProductCatalogAdmin)
admin.site.register(TypeMenu)

