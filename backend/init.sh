#!/bin/bash
# EkoClip Backend - Initialization Script

set -e

echo "🚀 Initializing EkoClip Secure Backend..."

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.21 or later."
    exit 1
fi

# Check Go version
GO_VERSION=$(go version | grep -o 'go[0-9]\+\.[0-9]\+' | sed 's/go//')
REQUIRED_VERSION="1.21"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$GO_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Go version $GO_VERSION is too old. Please upgrade to Go $REQUIRED_VERSION or later."
    exit 1
fi

echo "✅ Go $GO_VERSION detected"

# Install dependencies
echo "📦 Installing dependencies..."
go mod tidy
go mod download

# Run tests
echo "🧪 Running tests..."
go test -v ./...

# Build the application
echo "🔨 Building application..."
go build -o bin/ekoclip-api .

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Docker detected. Building Docker image..."
    docker build -t ekoclip-backend:latest .
    echo "✅ Docker image built: ekoclip-backend:latest"
fi

echo ""
echo "🎉 Backend initialization complete!"
echo ""
echo "To run the API server:"
echo "  go run main.go"
echo ""
echo "To run with Docker:"
echo "  docker run -p 8080:8080 ekoclip-backend:latest"
echo ""
echo "To run with docker-compose:"
echo "  docker-compose up -d"
echo ""
echo "API endpoints:"
echo "  GET  /api/v1/health      - Health check"
echo "  GET  /api/v1/csrf-token  - Get CSRF token"
echo "  POST /api/v1/contact     - Submit contact form"
echo "  POST /api/v1/ebook-order - Submit ebook order"
echo ""
echo "🔒 Security features enabled:"
echo "  • Rate limiting (10 requests/minute per IP)"
echo "  • CSRF protection"
echo "  • XSS prevention"
echo "  • Request size limits"
echo "  • Security headers"
echo "  • Input validation and sanitization"