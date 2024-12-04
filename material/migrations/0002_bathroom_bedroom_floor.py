# Generated by Django 5.1 on 2024-11-26 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('material', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bathroom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField(unique=True, verbose_name='Число санузлов')),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True, verbose_name='Название латинское')),
            ],
            options={
                'verbose_name_plural': 'Число санузлов',
                'ordering': ['number'],
            },
        ),
        migrations.CreateModel(
            name='Bedroom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField(unique=True, verbose_name='Число спален')),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True, verbose_name='Название латинское')),
            ],
            options={
                'verbose_name_plural': 'Число спален',
                'ordering': ['number'],
            },
        ),
        migrations.CreateModel(
            name='Floor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveIntegerField(unique=True, verbose_name='Этажность')),
                ('slug', models.SlugField(blank=True, max_length=255, unique=True, verbose_name='Название латинское')),
            ],
            options={
                'verbose_name_plural': 'Этажность',
                'ordering': ['number'],
            },
        ),
    ]
