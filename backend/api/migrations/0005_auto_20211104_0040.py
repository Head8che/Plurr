# Generated by Django 3.1.6 on 2021-11-04 00:40

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20211103_2205'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='postAuthorID',
        ),
        migrations.AddField(
            model_name='post',
            name='count',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='post',
            name='postAuthor',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_author', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='postImage',
            field=models.ImageField(blank=True, null=True, upload_to='users/%Y-%m-%d/'),
        ),
        migrations.AddField(
            model_name='post',
            name='type',
            field=models.CharField(default='post', max_length=100),
        ),
        migrations.AlterField(
            model_name='post',
            name='categories',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=100, null=True), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='post',
            name='content',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='contentType',
            field=models.CharField(choices=[('text/plain', 'Plain'), ('text/markdown', 'Markdown'), ('application/base64', 'Application'), ('image/png;base64', 'ImagePNG'), ('image/jpeg;base64', 'ImageJPEG')], default='text/plain', max_length=20),
        ),
        migrations.AlterField(
            model_name='post',
            name='description',
            field=models.CharField(blank=True, max_length=300, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='origin',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='postID',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='published',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='source',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='visibility',
            field=models.CharField(choices=[('PUBLIC', 'public'), ('PRIVATE', 'friends')], default='PUBLIC', max_length=10),
        ),
    ]