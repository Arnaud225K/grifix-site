from django.urls import path, re_path
from django.contrib.auth.decorators import login_required

# from .views import AdminMIndexView, AdminMImportView, AdminMImportRedirectView, AdminMImportInfoView, AdminMExportView, AdminMExportRedirectView
from .views import AdminMIndexView, AdminMImportView, AdminMImportInfoView, AdminMExportView, AdminMImportPriceView, AdminMExportPriceView, AdminMImportPriceInfoView


app_name = 'admin_m'
urlpatterns = [
    path('', login_required(AdminMIndexView.as_view(), login_url="/admin/login"), name='index'),
    path('import/', login_required(AdminMImportView.as_view(), login_url="/admin/login"), name='import'),
    path('import_price/', login_required(AdminMImportPriceView.as_view(), login_url="/admin/login"), name='import_price'),
    re_path(r'^import/(?P<import_info_slug>[-\w]+)/$', login_required(AdminMImportInfoView.as_view(), login_url="/admin/login"), name='import_info'),
    re_path(r'^import_price/(?P<import_info_slug>[-\w]+)/$', login_required(AdminMImportPriceInfoView.as_view(), login_url="/admin/login"), name='import_price_info'),
    path('export/', login_required(AdminMExportView.as_view(), login_url="/admin/login"), name='export'),
    path('export_price/', login_required(AdminMExportPriceView.as_view(), login_url="/admin/login"), name='export_price'),
]