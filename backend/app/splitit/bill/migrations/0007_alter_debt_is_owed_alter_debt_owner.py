# Generated by Django 5.0 on 2024-01-01 16:42

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('splitit_bill', '0006_alter_debt_ratio'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='debt',
            name='is_owed',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owes', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='debt',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL),
        ),
    ]
