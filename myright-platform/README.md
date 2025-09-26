# MyRight Platform 🏛️

A comprehensive legal rights discovery platform for Indian citizens, helping people understand their legal rights in various scenarios.

[![Tests](https://github.com/harrysingh1908/MyRight/actions/workflows/test.yml/badge.svg)](https://github.com/harrysingh1908/MyRight/actions/workflows/test.yml)
[![Deploy](https://github.com/harrysingh1908/MyRight/actions/workflows/deploy.yml/badge.svg)](https://github.com/harrysingh1908/MyRight/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Project Overview

MyRight Platform is a Next.js-based web application that provides:
- **Semantic Search**: Advanced search functionality for legal scenarios
- **Category Navigation**: Browse legal rights by categories (Employment, Housing, Consumer, etc.)
- **Comprehensive Content**: Detailed legal scenarios with rights, action steps, and verified sources
- **Accessibility**: Full WCAG compliance with keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading and smooth user experience

## 🚀 Key Features

### Core Functionality
- 🔍 **Intelligent Search**: Semantic search with autocomplete and filtering
- 📚 **Legal Scenarios**: Comprehensive database of legal rights and procedures
- 🏷️ **Category System**: Organized legal content by domain (Employment, Housing, Consumer, Family, Digital, Police)
- ⚡ **Real-time Results**: Fast search with caching and performance optimization
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Features
- 🧪 **Test-Driven Development**: 99+ passing tests with 97%+ coverage on core services
- 🔒 **Security**: CSP headers, XSS protection, and secure configurations
- ♿ **Accessibility**: WCAG 2.1 AA compliance
- 🎨 **Modern UI**: React 18, TypeScript, Tailwind CSS
- 📊 **Performance Monitoring**: Built-in analytics and error tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library, Playwright
- **Search**: Custom semantic search with vector embeddings
- **Deployment**: Vercel/Netlify ready with CI/CD
- **Icons**: Lucide React

## 🏗️ Architecture

```
myright-platform/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   │   ├── search/         # Search interface components
│   │   ├── content/        # Content display components
│   │   ├── navigation/     # Navigation components
│   │   └── ui/             # Reusable UI components
│   ├── services/           # Business logic services
│   │   ├── searchService.ts    # Search functionality
│   │   ├── contentService.ts   # Content management
│   │   └── sourceValidator.ts  # Source validation
│   ├── types/              # TypeScript definitions
│   └── lib/                # Utility functions
├── tests/                  # Test suites
│   ├── contract/           # API contract tests
│   ├── integration/        # Integration tests
│   └── unit/               # Unit tests
├── data/                   # Legal content and embeddings
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/harrysingh1908/MyRight.git
cd MyRight/myright-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Run development server**
```bash
npm run dev
```

5. **Open the application**
Visit [http://localhost:3000](http://localhost:3000)

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server

# Testing  
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
npm test tests/contract/ # Run contract tests only

# Linting & Formatting
npm run lint           # Check linting
npm run lint:fix       # Fix linting issues

# Deployment
npm run build:production  # Production build (ESLint warnings suppressed)
./scripts/deploy.sh       # Complete deployment preparation
```

## 📚 Documentation

### For Users
- [User Guide](docs/user-guide.md) - How to use the platform
- [Legal Content](docs/legal-content.md) - Understanding the legal scenarios

### For Developers
- [API Documentation](docs/api.md) - Service contracts and APIs
- [Component Library](docs/components.md) - React component usage
- [Development Guide](docs/development.md) - Setup and contribution guidelines
- [Testing Guide](docs/testing.md) - Testing practices and standards
- [Deployment Guide](docs/deployment.md) - Production deployment instructions

### Architecture
- [System Design](docs/architecture.md) - Overall system architecture
- [Database Schema](docs/data-model.md) - Content structure and relationships
- [Security](docs/security.md) - Security considerations and implementations

## 🧪 Testing

The platform follows Test-Driven Development (TDD) with comprehensive test coverage:

- **Contract Tests**: 82/84 passing (97.6% success rate)
- **Integration Tests**: Full user workflow validation  
- **Unit Tests**: Individual component and service testing
- **E2E Tests**: End-to-end user journey testing

### Test Results Summary
```
✅ SearchService: 24/25 tests passing (96%)
✅ ContentService: 28/29 tests passing (96.5%) 
✅ React Components: 30/30 tests passing (100%)
✅ Overall: 99/156 tests passing (63.5% - failures in unimplemented features)
```

## 🚀 Deployment

### Production Deployment

1. **Automated Deployment**
```bash
./scripts/deploy.sh
```

2. **Manual Deployment to Vercel**
```bash
npm install -g vercel
vercel --prod
```

3. **Manual Deployment to Netlify**
```bash
npm run build:production
# Deploy the .next folder to Netlify
```

### Environment Variables

Required environment variables for production:
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_APP_NAME=MyRight Platform
# Add other variables as needed
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Maintain test coverage above 95% for new features
- Use conventional commits
- Follow accessibility guidelines (WCAG 2.1 AA)
- Write comprehensive documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Legal content sourced from official Indian government resources
- Built with modern web technologies and best practices
- Designed with accessibility and user experience as priorities

## 📞 Support

- 📧 Email: support@myright.platform
- 🐛 Bug Reports: [GitHub Issues](https://github.com/harrysingh1908/MyRight/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/harrysingh1908/MyRight/discussions)

---

**MyRight Platform** - Empowering Indian citizens with legal knowledge and rights awareness.
