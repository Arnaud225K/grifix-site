# Generated by Django 5.1 on 2024-11-13 10:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project_settings', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectsettings',
            name='text_category',
        ),
        migrations.RemoveField(
            model_name='projectsettings',
            name='text_index',
        ),
    ]