# Generated by Django 3.2.7 on 2021-10-26 04:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_post'),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('author', models.CharField(default='0', max_length=100)),
                ('postID', models.CharField(blank=True, max_length=100, null=True)),
                ('commentID', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.AlterField(
            model_name='post',
            name='contentType',
            field=models.CharField(default='contentType', max_length=20),
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('comment', models.CharField(max_length=300)),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('id', models.CharField(max_length=400, primary_key=True, serialize=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='network.author')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='network.post')),
            ],
        ),
    ]
