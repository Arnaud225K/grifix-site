# Generated by Django 5.1 on 2024-11-22 08:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('o_compania', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='advantage',
            name='title',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Название'),
        ),
    ]
