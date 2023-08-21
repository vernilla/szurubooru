#!/usr/bin/dumb-init /bin/sh
set -e
cd /opt/app

alembic upgrade head

echo "Starting szurubooru API on port ${PORT} - Running on ${THREADS} threads"
<<<<<<< HEAD
exec waitress-serve-3 --port ${PORT} --threads ${THREADS} szurubooru.facade:app
=======
exec waitress-serve-3 --port ${PORT} --threads ${THREADS} szurubooru.facade:app
>>>>>>> parent of 63f687a6 (maybe this will fix it?)
