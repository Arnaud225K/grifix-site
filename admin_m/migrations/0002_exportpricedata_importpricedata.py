# Generated by Django 5.1 on 2024-12-19 20:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('admin_m', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExportPriceData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Категория')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('user', models.CharField(max_length=256, verbose_name='Пользователь')),
                ('email', models.EmailField(blank=True, default='', max_length=50, null=True, verbose_name='E-mail')),
                ('result_percent', models.DecimalField(blank=True, decimal_places=2, default='0', max_digits=5, null=True, verbose_name='Процент выполнения')),
                ('result', models.CharField(blank=True, default='', max_length=1024, null=True, verbose_name='Результат')),
                ('info', models.TextField(blank=True, default='', editable=False, null=True, verbose_name='Информация')),
                ('link', models.CharField(blank=True, default='', max_length=1024, null=True, verbose_name='Ссылка')),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admin_m.statedata', verbose_name='Состояние')),
            ],
            options={
                'verbose_name_plural': 'Результаты экспорта редиректов',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='ImportPriceData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='Наименование')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('user', models.CharField(max_length=256, verbose_name='Пользователь')),
                ('email', models.EmailField(blank=True, default='', editable=False, max_length=50, null=True, verbose_name='E-mail')),
                ('action', models.CharField(blank=True, default='', max_length=1024, null=True, verbose_name='Операция')),
                ('result', models.CharField(blank=True, default='', max_length=1024, null=True, verbose_name='Результат')),
                ('result_percent', models.DecimalField(blank=True, decimal_places=2, default='0', max_digits=5, null=True, verbose_name='Процент выполнения')),
                ('info', models.TextField(blank=True, default='', null=True, verbose_name='Информация')),
                ('file', models.FileField(blank=True, default='', null=True, upload_to='import/files', verbose_name='Файл')),
                ('state', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admin_m.statedata', verbose_name='Состояние')),
            ],
            options={
                'verbose_name_plural': 'Результаты импорта редиректов',
                'ordering': ['-date'],
            },
        ),
    ]
