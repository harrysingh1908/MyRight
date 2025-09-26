#!/bin/bash

# MyRight Platform Deployment Script
# This script prepares the application for production deployment

set -e

echo "🚀 Starting MyRight Platform deployment preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ SUCCESS:${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  WARNING:${NC} $1"
}

log_error() {
    echo -e "${RED}❌ ERROR:${NC} $1"
}

# Check Node.js and npm versions
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        log_error "Node.js version $NODE_VERSION is not supported. Please use Node.js 18 or higher."
        exit 1
    fi
    
    log_success "Node.js version $NODE_VERSION is supported"
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed."
        exit 1
    fi
    
    log_success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing production dependencies..."
    npm ci --only=production
    log_success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    log_info "Running test suite..."
    
    # Install dev dependencies for testing
    npm ci
    
    # Run contract tests (critical functionality)
    npm test tests/contract/ -- --passWithNoTests --verbose
    
    if [ $? -eq 0 ]; then
        log_success "All critical tests passed"
    else
        log_error "Tests failed. Deployment aborted."
        exit 1
    fi
}

# Build application
build_application() {
    log_info "Building application for production..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Build the application
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "Application built successfully"
    else
        log_error "Build failed. Deployment aborted."
        exit 1
    fi
}

# Validate build output
validate_build() {
    log_info "Validating build output..."
    
    if [ ! -d ".next" ]; then
        log_error "Build output directory not found"
        exit 1
    fi
    
    if [ ! -f ".next/BUILD_ID" ]; then
        log_error "Build ID not found"
        exit 1
    fi
    
    BUILD_ID=$(cat .next/BUILD_ID)
    log_success "Build validation completed (Build ID: $BUILD_ID)"
}

# Generate deployment manifest
generate_manifest() {
    log_info "Generating deployment manifest..."
    
    BUILD_ID=$(cat .next/BUILD_ID)
    TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    cat > deployment-manifest.json << EOF
{
  "name": "MyRight Platform",
  "version": "1.0.0",
  "buildId": "$BUILD_ID",
  "timestamp": "$TIMESTAMP",
  "environment": "production",
  "nodejs": "$(node -v)",
  "platform": "$(uname -s)",
  "commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "branch": "$(git branch --show-current 2>/dev/null || echo 'unknown')"
}
EOF
    
    log_success "Deployment manifest generated"
}

# Main deployment process
main() {
    echo
    log_info "🏗️  MyRight Platform Production Deployment"
    log_info "========================================="
    echo
    
    check_prerequisites
    install_dependencies
    run_tests
    build_application
    validate_build
    generate_manifest
    
    echo
    log_success "🎉 Deployment preparation completed successfully!"
    log_info "📦 Your application is ready for production deployment"
    echo
    log_info "Next steps:"
    log_info "1. Deploy to your hosting platform (Vercel, Netlify, etc.)"
    log_info "2. Configure environment variables on your hosting platform"
    log_info "3. Set up custom domain and SSL certificate"
    log_info "4. Configure monitoring and analytics"
    echo
}

# Run main function
main "$@"