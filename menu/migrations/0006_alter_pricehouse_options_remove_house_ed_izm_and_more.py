# Generated by Django 5.1 on 2024-11-27 07:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0005_remove_house_available_remove_house_param_1_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='pricehouse',
            options={'verbose_name_plural': 'Цена/Материал'},
        ),
        migrations.RemoveField(
            model_name='house',
            name='ed_izm',
        ),
        migrations.RemoveField(
            model_name='house',
            name='material',
        ),
        migrations.RemoveField(
            model_name='pricehouse',
            name='ed_izm',
        ),
    ]
