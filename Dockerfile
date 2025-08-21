# This will build the Vite frontend
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY react-vite/package*.json ./
RUN npm install
COPY react-vite/ .
RUN npm run build

# This will build the Flask backend
FROM python:3.9.18-alpine3.18

# This installs system dependencies
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev

# The environment variables (Render passes these at runtime too)
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

# This installs Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir psycopg2

# This copies backend source
COPY . .

# This will copy built frontend into Flask's static/templates
COPY --from=frontend-build /frontend/dist ./app/static
COPY --from=frontend-build /frontend/dist/index.html ./app/templates

# This wiil run migrations & seed
RUN flask db upgrade
RUN flask seed all

# And this will start the app
CMD gunicorn app:app
