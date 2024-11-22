# Generated by Django 5.1 on 2024-11-15 10:45

import django_ckeditor_5.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Material',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Название')),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True, verbose_name='Название латинское')),
                ('description', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Описание')),
            ],
            options={
                'verbose_name_plural': 'Материал',
                'ordering': ['name'],
            },
        ),
    ]