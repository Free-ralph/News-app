# Generated by Django 3.2.15 on 2022-09-15 13:00

from django.db import migrations, models
import django.db.models.deletion
import django_unixdatetimefield.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Base',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('category', models.CharField(max_length=100)),
                ('score', models.IntegerField()),
                ('author', models.CharField(max_length=100)),
                ('url', models.URLField()),
                ('created_at', django_unixdatetimefield.fields.UnixDateTimeField()),
                ('text', models.TextField()),
                ('parts', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.base')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(max_length=100)),
                ('text', models.CharField(max_length=200)),
                ('created_at', django_unixdatetimefield.fields.UnixDateTimeField()),
                ('base', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.base')),
                ('comments', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.comment')),
            ],
        ),
    ]