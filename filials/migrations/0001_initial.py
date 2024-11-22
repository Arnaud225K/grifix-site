# Generated by Django 5.1 on 2024-11-13 10:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Filials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order_number', models.FloatField(blank=True, null=True, verbose_name='Порядковый номер')),
                ('name', models.CharField(max_length=100, verbose_name='Название')),
                ('name_info', models.CharField(blank=True, max_length=100, null=True, verbose_name='Название (падеж для подстановки)')),
                ('region', models.CharField(blank=True, max_length=100, null=True, verbose_name='Область')),
                ('subdomain_name', models.CharField(max_length=100, verbose_name='Название поддомена')),
                ('phone', models.CharField(blank=True, max_length=50, null=True, verbose_name='Телефон')),
                ('email', models.CharField(blank=True, max_length=50, null=True, verbose_name='Электронная почта')),
                ('phone_dop', models.CharField(blank=True, max_length=50, null=True, verbose_name='Телефон (дополнительный)')),
                ('address', models.CharField(blank=True, max_length=256, null=True, verbose_name='Адрес')),
                ('rezhim', models.CharField(blank=True, max_length=1024, null=True, verbose_name='Режим работы')),
                ('comment', models.TextField(blank=True, null=True, verbose_name='Карта проезда')),
                ('robots', models.TextField(blank=True, null=True, verbose_name='Общий robots.txt')),
                ('sitemap_name', models.CharField(blank=True, max_length=1024, null=True, verbose_name='Имя карты сайта')),
                ('req_file', models.FileField(blank=True, null=True, upload_to='uploads/files', verbose_name='Реквизиты (файл)')),
                ('sertificate', models.CharField(blank=True, max_length=1024, null=True, verbose_name='Сертификат')),
                ('text_head_filial', models.TextField(blank=True, null=True, verbose_name='Блок в head для филиала (внизу)')),
                ('text_body_filial', models.TextField(blank=True, null=True, verbose_name='Блок в body для филиала (внизу)')),
                ('full_name_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Полное наименование предприятия')),
                ('short_name_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Краткое наименование предприятия')),
                ('inn_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ИНН')),
                ('kpp_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='КПП')),
                ('bin_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='БИН (КЗ)')),
                ('ikk_1_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ИКК 1 (КЗ)')),
                ('ikk_2_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ИКК 2 (КЗ)')),
                ('yr_address_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Юридический адрес')),
                ('fact_address_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Фактический адрес')),
                ('phone_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Телефон (реквизиты)')),
                ('email_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Электронная почта (реквизиты)')),
                ('okved_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ОКВЭД')),
                ('okpo_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ОКПО')),
                ('okato_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ОКАТО')),
                ('okfs_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ОКФС')),
                ('okopf_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ОКОПФ')),
                ('bank_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Банк')),
                ('bik_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='БИК')),
                ('chet_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='Расчетный счет')),
                ('korr_chet_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='Коректирующий счет')),
                ('nalog_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Постановка в налоговый учет')),
                ('reg_req', models.CharField(blank=True, max_length=256, null=True, verbose_name='Госрегистрация')),
                ('ogrn_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ОГРН')),
                ('oktmo_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='ОКТМО')),
                ('director_req', models.CharField(blank=True, max_length=100, null=True, verbose_name='Директор (на основании устава)')),
                ('image', models.ImageField(blank=True, editable=False, null=True, upload_to='uploads/images', verbose_name='Картинка')),
                ('is_main', models.BooleanField(blank=True, verbose_name='Отображается без поддомена (по умолчанию)')),
                ('is_base', models.BooleanField(blank=True, default=False, verbose_name='Популярные города')),
                ('isHidden', models.BooleanField(blank=True, default=False, verbose_name='Скрыть')),
                ('geo', models.TextField(blank=True, null=True, verbose_name='Код карты')),
                ('filials_name', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='filials.filials', verbose_name='Основной филиал')),
            ],
            options={
                'verbose_name_plural': 'Филиалы (Города)',
                'ordering': ['order_number', 'name'],
            },
        ),
    ]
