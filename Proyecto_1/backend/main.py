from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import contradicciones

app = FastAPI(
    title="Logic Detective API",
    description="Motor de Inferencia para Investigaciones Criminales usando Prolog y Python (Responsabilidad 4)",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar Routers
app.include_router(contradicciones.router)

@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "status": "online",
        "system": "Logic Detective API Engine",
        "version": "1.0.0",
        "modulo_activo": "Responsabilidad 4 (Contradicciones, Declaraciones y Cómplices)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
