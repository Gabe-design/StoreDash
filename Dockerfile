# This will build the Vite frontend
FROM node:18 AS frontend-build
WORKDIR /frontend
COPY react-vite/package*.json ./
RUN npm install
COPY react-vite/ ./
RUN npm run build 

# This will build the Flask backend
FROM python:3.9.18-alpine3.18

# Install system dependencies
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev

# Environment variables (Render will also inject at runtime)
ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir psycopg2

# Copy backend source
COPY . .

# Copy built frontend into Flask’s static/templates
COPY --from=frontend-build /frontend/dist ./app/static
COPY --from=frontend-build /frontend/dist/index.html ./app/templates

# Run migrations + seed + start app at runtime
CMD flask db upgrade && flask seed all && gunicorn app:app
