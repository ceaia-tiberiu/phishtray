# Generated by Django 2.0.5 on 2018-05-23 14:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('participant', '0007_auto_20180523_1422'),
    ]

    operations = [
        migrations.AlterField(
            model_name='participant',
            name='exercise',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='exercise.Exercise'),
        ),
    ]