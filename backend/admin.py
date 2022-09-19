from django.contrib import admin
from .models import Base, Comment, PollOptions


class BaseAdmin(admin.ModelAdmin):
    list_display = (
        'title', 
        'category'
    )
    readonly_fields = (
        'created_at',
    )


admin.site.register(Base, BaseAdmin)
admin.site.register(Comment)
admin.site.register(PollOptions)