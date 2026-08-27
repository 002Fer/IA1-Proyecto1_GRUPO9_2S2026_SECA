FROM python:3.11-slim

# Evita prompts interactivos y buffers en logs
ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

# Instala SWI-Prolog y dependencias necesarias para PySwip
RUN apt-get update && apt-get install -y --no-install-recommends \
    swi-prolog \
    swi-prolog-nox \
    build-essential \
    libffi-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Instala dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código del backend
COPY . .

# Expone el puerto de FastAPI
EXPOSE 8000

# Comando para iniciar el backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
