# Generated by Django 5.1 on 2024-11-25 10:31

import django_ckeditor_5.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Offers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.IntegerField(blank=True, null=True, verbose_name='Порядковый номер')),
                ('name', models.CharField(max_length=512, verbose_name='Название')),
                ('slug', models.SlugField(blank=True, max_length=512, null=True, verbose_name='Название латинское')),
                ('description', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Описание')),
                ('text', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Текст')),
                ('image', models.ImageField(blank=True, null=True, upload_to='uploads/images', verbose_name='Картинка основная')),
                ('image_2', models.ImageField(blank=True, null=True, upload_to='uploads/images', verbose_name='Вторая картинка')),
                ('title_main', models.CharField(blank=True, max_length=1024, null=True, verbose_name='Заголовок страницы')),
                ('keywords', models.TextField(blank=True, null=True, verbose_name='Ключевые слова (мета)')),
                ('keywords_description', models.TextField(blank=True, null=True, verbose_name='Описание (мета)')),
                ('is_show_main', models.BooleanField(blank=True, default=False, verbose_name='Показывать на главной')),
                ('is_hidden', models.BooleanField(blank=True, verbose_name='Скрыть')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлено')),
            ],
            options={
                'verbose_name_plural': 'Акции',
                'ordering': ['order_number'],
            },
        ),
    ]