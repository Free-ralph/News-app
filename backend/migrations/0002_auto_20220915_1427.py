# Generated by Django 3.2.15 on 2022-09-15 13:27

from django.db import migrations, models
import django.db.models.deletion
import django_unixdatetimefield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='comments',
            new_name='kids',
        ),
        migrations.AlterField(
            model_name='base',
            name='parts',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.base'),
        ),
        migrations.AlterField(
            model_name='base',
            name='score',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='base',
            name='text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='base',
            name='url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='PollOPtions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(max_length=100)),
                ('created_at', django_unixdatetimefield.fields.UnixDateTimeField()),
                ('score', models.IntegerField(blank=True, null=True)),
                ('base', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.base')),
                ('kids', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='backend.polloptions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
