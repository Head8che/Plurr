# Generated by Django 3.2.9 on 2021-12-08 17:25

import api.models.accountRegistrationModel
from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('type', models.CharField(default='author', max_length=100)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('id', models.URLField(blank=True, null=True)),
                ('displayName', models.CharField(blank=True, max_length=100, null=True)),
                ('url', models.URLField(blank=True, null=True)),
                ('host', models.URLField(blank=True, max_length=150, null=True)),
                ('github', models.URLField(blank=True, null=True)),
                ('profileImage', models.URLField(blank=True, null=True)),
                ('followers', models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='accountRequest',
            fields=[
                ('displayName', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('github', models.URLField(validators=[api.models.accountRegistrationModel.validateGithub], verbose_name='github')),
                ('host', models.URLField()),
                ('username', models.CharField(error_messages={'unique': 'This username is not available.'}, help_text='Incorrect input, please try again!', max_length=50, primary_key=True, serialize=False, unique=True, validators=[api.models.accountRegistrationModel.validateUser], verbose_name='username')),
            ],
        ),
        migrations.CreateModel(
            name='Inbox',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(default='inbox', max_length=100)),
                ('author', models.URLField(blank=True, null=True)),
                ('items', models.JSONField(blank=True, default=list, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('host', models.URLField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=100)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('remoteUsername', models.CharField(blank=True, max_length=100, null=True)),
                ('remotePassword', models.CharField(blank=True, max_length=128, null=True, verbose_name='remote_password')),
                ('connectedDate', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('type', models.CharField(default='post', max_length=100)),
                ('title', models.TextField(default='Post Title', max_length=150)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('id', models.URLField(blank=True, null=True)),
                ('source', models.URLField(blank=True, null=True)),
                ('origin', models.URLField(blank=True, null=True)),
                ('description', models.CharField(blank=True, max_length=300, null=True)),
                ('contentType', models.CharField(choices=[('text/plain', 'Plain'), ('text/markdown', 'Markdown'), ('application/base64', 'Application'), ('image/png;base64', 'ImagePNG'), ('image/jpeg;base64', 'ImageJPEG')], default='text/plain', max_length=20)),
                ('content', models.TextField(blank=True, null=True)),
                ('image', models.TextField(blank=True, null=True)),
                ('categories', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=100, null=True), blank=True, null=True, size=None)),
                ('count', models.IntegerField(blank=True, null=True)),
                ('comments', models.URLField(blank=True, null=True)),
                ('published', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('visibility', models.CharField(choices=[('PUBLIC', 'public'), ('FRIENDS', 'friends')], default='PUBLIC', max_length=10)),
                ('unlisted', models.BooleanField(default=False)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_author', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('context', models.CharField(default='https://www.w3.org/ns/activitystreams', max_length=100)),
                ('summary', models.CharField(blank=True, max_length=500, null=True)),
                ('type', models.CharField(default='like', max_length=100)),
                ('object', models.URLField(blank=True, null=True)),
                ('date', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='like_author', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(blank=True, default='follow', max_length=50, null=True)),
                ('summary', models.CharField(blank=True, max_length=100, null=True)),
                ('actor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='friend_request_actor', to=settings.AUTH_USER_MODEL)),
                ('object', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='friend_request_object', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('type', models.CharField(default='comment', max_length=50)),
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('id', models.URLField(blank=True, null=True)),
                ('comment', models.TextField(blank=True, null=True)),
                ('contentType', models.CharField(choices=[('text/plain', 'Plain'), ('text/markdown', 'Markdown')], default='text/plain', max_length=18)),
                ('published', models.DateTimeField(blank=True, default=django.utils.timezone.now, null=True)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comment_author', to=settings.AUTH_USER_MODEL)),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comment_post', to='api.post')),
            ],
        ),
    ]
