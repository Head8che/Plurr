release: python manage.py makemigrations && python manage.py migrate
web: gunicorn nework.wsgi:application --log-file -