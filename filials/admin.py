from django.contrib import admin

from filials.models import Filials


class FilialsAdmin(admin.ModelAdmin):
    list_display = ('name', 'subdomain_name', 'filials_name', 'phone', 'email',)
    search_fields = ('name',)
admin.site.register(Filials, FilialsAdmin)