# Generated by Django 5.1 on 2024-11-28 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('menu', '0007_delete_additionalparam_alter_house_dop_param'),
    ]

    operations = [
        migrations.AlterField(
            model_name='house',
            name='is_hidden',
            field=models.BooleanField(db_index=True, default=False, verbose_name='Скрыть'),
        ),
        migrations.AlterField(
            model_name='house',
            name='name',
            field=models.CharField(db_index=True, max_length=1024, verbose_name='Название'),
        ),
    ]
