from django.contrib import admin

# Register your models here.
from .models import Debt

admin.site.register(Debt, admin.ModelAdmin)
