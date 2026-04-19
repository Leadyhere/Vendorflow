# Stage 1: Build the React Frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the FastAPI Backend
FROM python:3.11-slim
WORKDIR /app

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy the built frontend from Stage 1 into the expected location
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the port Cloud Run uses (defaults to 8080)
EXPOSE 8080
ENV PORT=8080

# Command to run the application using uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
