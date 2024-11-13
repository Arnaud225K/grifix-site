from django.contrib import admin
from django.contrib.admin.models import LogEntry
from rangefilter.filters import DateRangeFilterBuilder

from .models import ProjectSettings, SocialLink


class SocialLinkInline(admin.TabularInline):
	model = SocialLink
	
class ProjectSettingsAdmin(admin.ModelAdmin):
	inlines = [
		SocialLinkInline,
	]
admin.site.register(ProjectSettings, ProjectSettingsAdmin)


#Custom Journal on site for LogEntry
class LogEntryAdmin(admin.ModelAdmin):
  list_display = ('action_flag', 'user', 'content_type', 'object_repr', 'get_change_message', 'action_time')
  search_fields = ('user__username', 'content_type__model','object_repr',)
  list_filter = ('action_flag', ('action_time', DateRangeFilterBuilder()),)
admin.site.register(LogEntry, LogEntryAdmin)
