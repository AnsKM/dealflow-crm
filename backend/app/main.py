"""Main FastAPI application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.db.database import engine, Base
from app.api.routes import auth, deals, activities, webhooks

# Setup logging
setup_logging("INFO" if not settings.DEBUG else "DEBUG")
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting DealFlow application...")

    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")

    yield

    # Shutdown
    logger.info("Shutting down DealFlow application...")


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligenter CRM-Assistent für den deutschen B2B-Vertrieb",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to DealFlow API",
        "version": settings.VERSION,
        "docs": "/docs",
    }


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(deals.router, prefix="/api/deals", tags=["Deals"])
app.include_router(activities.router, prefix="/api/activities", tags=["Activities"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["Webhooks"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
    )
