from django.urls import path, include, re_path
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    path('service/',include('api.urls')),
    path('admin/', admin.site.urls),
    re_path('.*', TemplateView.as_view(template_name='index.html')),
]

