from django.contrib import admin
from .models import About_us, Task_company, Principle, Advantage, Review


class TaskCompanyAdmin(admin.TabularInline):
    model = Task_company

class PrincipleAdmin(admin.TabularInline):
    model = Principle

class AdvantageAdmin(admin.TabularInline):
    model = Advantage

class AboutUsAdmin(admin.ModelAdmin):
    inlines = (TaskCompanyAdmin,PrincipleAdmin,AdvantageAdmin)
    list_display=('name','created_at','is_hidden',)
    search_fields = ('name',)
    list_filter = ('is_hidden',)
admin.site.register(About_us, AboutUsAdmin)

class ReviewAdmin(admin.ModelAdmin):
    list_display=('title','created_at','is_hidden',)
    search_fields = ('title',)
    list_filter = ('is_hidden',)
admin.site.register(Review, ReviewAdmin)