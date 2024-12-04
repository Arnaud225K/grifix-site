# Generated by Django 5.1 on 2024-11-26 08:23

import django_ckeditor_5.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Services',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.IntegerField(blank=True, null=True, verbose_name='Порядковый номер')),
                ('name', models.CharField(max_length=512, verbose_name='Название')),
                ('description', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Описание')),
                ('text', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Текст')),
                ('image', models.ImageField(blank=True, null=True, upload_to='uploads/images', verbose_name='Картинка')),
                ('is_hidden', models.BooleanField(blank=True, verbose_name='Скрыть')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Создано')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Обновлено')),
            ],
            options={
                'verbose_name_plural': 'Услуги',
                'ordering': ['order_number'],
            },
        ),
    ]
