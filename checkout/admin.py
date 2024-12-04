from django.contrib import admin
from rangefilter.filters import DateRangeFilterBuilder
from checkout.models import Order


class OrderAdmin(admin.ModelAdmin):
	list_display = ('__str__', 'date', 'type_order', 'type_client', 'email_to', 'ip_address', 'name', 'phone', 'email', 'text')
	list_filter = ('date',('date', DateRangeFilterBuilder()),)
	search_fields = ('type_order','email_to', 'email', 'name', 'id', 'phone', 'type_client', 'text')
	fieldsets = (
		('Info', {'fields': ('name', 'email', 'phone', 'text', 'ip_address',)}),
	)
admin.site.register(Order, OrderAdmin)