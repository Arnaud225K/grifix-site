# Generated by Django 5.1 on 2024-12-12 09:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0010_remove_house_bathrom_remove_house_bedrom_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='house',
            name='price',
            field=models.DecimalField(blank=True, decimal_places=0, default=0, max_digits=12, null=True, verbose_name='Базовая цена'),
        ),
    ]
