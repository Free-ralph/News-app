# Generated by Django 3.2.15 on 2022-09-16 21:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_base_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='created_at',
            field=models.DateTimeField(),
        ),
        migrations.AlterField(
            model_name='polloptions',
            name='created_at',
            field=models.DateTimeField(),
        ),
    ]