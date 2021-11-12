release: python manage.py makemigrations && python manage.py migrate
web: gunicorn network.wsgi --log-file -