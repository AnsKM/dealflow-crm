#!/bin/bash

# DealFlow CRM Quick Start Script
# One-command setup for development and demo

set -e  # Exit on error

echo "🚀 DealFlow CRM Quick Start"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose not found. Please install Docker Compose.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker Compose is available${NC}"

# Stop any running containers
echo ""
echo "🛑 Stopping any existing containers..."
docker-compose down 2>/dev/null || true

# Build and start containers
echo ""
echo "🏗️  Building and starting containers..."
docker-compose up -d --build

# Wait for services to be healthy
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check backend health
echo ""
echo "🔍 Checking backend health..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        echo "Check logs with: docker-compose logs backend"
        exit 1
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

# Run database migrations and seed data
echo ""
echo "🌱 Seeding database with demo data..."
docker-compose exec -T backend python seed_data.py

# Check if seeding was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Database seeding had warnings (this is normal if data already exists)${NC}"
fi

# Display success message
echo ""
echo "================================"
echo -e "${GREEN}🎉 DealFlow CRM is ready!${NC}"
echo "================================"
echo ""
echo "📱 Application URLs:"
echo "   Frontend:  http://localhost:5174"
echo "   Backend:   http://localhost:8000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "🔐 Demo Credentials:"
echo "   Email:     demo@dealflow.de"
echo "   Password:  demo123"
echo ""
echo "📊 The demo includes:"
echo "   • 20 realistic B2B deals"
echo "   • Multiple activities per deal"
echo "   • AI-powered recommendations"
echo "   • Health scoring"
echo "   • Pipeline analytics"
echo ""
echo "🛠️  Useful Commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Reset data:       docker-compose down -v && ./quick_start.sh"
echo ""
echo "🔗 Automation Examples:"
echo "   Webhooks API:     http://localhost:8000/docs#/Webhooks"
echo "   Bulk Operations:  http://localhost:8000/docs#/Deals"
echo ""
echo "Happy selling! 💼"
