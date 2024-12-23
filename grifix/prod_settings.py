# from .settings import *
import os
# from pathlib import Path
from decouple import config
# import getpass


# Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY_PROD')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG_PROD', cast=bool)

ALLOWED_HOSTS = ['localhost', '127.0.0.1']
# ALLOWED_HOSTS = config("DJANGO_ALLOWED_HOSTS", default='*').split(",")




DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': 'localhost',
        'USER': 'rasalas',
        'PASSWORD': 'tkPoWm9skRfTg225',
        'NAME': 'grifix',
        'PORT': '3306', 
        'CONN_MAX_AGE': 60 * 10,  # 10 minutes
		'OPTIONS': {
			'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
			'charset': 'utf8mb4',
		}
    },
}
