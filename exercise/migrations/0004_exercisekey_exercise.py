# Generated by Django 2.0.5 on 2018-05-23 10:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('exercise', '0003_exercisekey'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercisekey',
            name='exercise',
            field=models.ManyToManyField(to='exercise.Exercise'),
        ),
    ]