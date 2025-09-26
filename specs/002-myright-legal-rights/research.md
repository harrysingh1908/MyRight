# Research & Technical Decisions: MyRight Platform

**Date**: 2025-09-26  
**Phase**: 0 - Research & Architecture  
**Status**: Completed

## Technology Stack Research

### Frontend Framework Decision
**Selected**: Next.js 14+ with React 18+ and TypeScript
**Rationale**: 
- Static Site Generation (SSG) for optimal performance and SEO
- Built-in PWA capabilities for offline functionality
- TypeScript for type safety in semantic search implementation
- Excellent mobile optimization and responsive design capabilities
- Zero-config deployment to Vercel/Netlify

**Alternative Considered**: Vanilla React with Vite
**Rejected**: Less optimized for static generation and PWA requirements

### Semantic Search Technology
**Selected**: sentence-transformers with all-MiniLM-L6-v2 model
**Rationale**:
- Lightweight model suitable for client-side processing
- Excellent performance for semantic similarity tasks in English
- Pre-computed embeddings can be stored as JSON for fast loading
- Proven accuracy for legal/informational text matching
- Can run in browser environment with proper optimization

**Alternative Considered**: OpenAI embeddings API
**Rejected**: Requires API calls, increases costs, creates dependencies

### Content Architecture Research
**Selected**: Structured JSON with embedded vectors
**Structure**:
```json
{
  "scenarios": [
    {
      "id": "salary-unpaid",
      "title": "Unpaid or Delayed Salary",
      "description": "When employer fails to pay salary on time",
      "category": "employment",
      "rights": [
        {
          "text": "Right to receive salary within 7th day of month",
          "citation": "Payment of Wages Act 1936, Section 5",
          "source": "https://legislative.gov.in/sites/default/files/A1936-04.pdf"
        }
      ],
      "actionSteps": [...],
      "variations": [
        "boss not paying salary",
        "company didn't pay me",
        "employer owes money"
      ],
      "embedding": [0.1234, -0.5678, ...] // Pre-computed vector
    }
  ]
}
```

### Deployment Strategy Research
**Selected**: Static hosting with CDN (Vercel primary, Netlify backup)
**Rationale**:
- Zero server costs for MVP
- Global CDN for fast loading worldwide
- Automatic HTTPS and performance optimization
- Simple CI/CD integration with GitHub
- Built-in analytics and monitoring

### Legal Content Strategy Research
**Approach**: Focus on Central/Federal laws to avoid state complexity
**Primary Sources**:
- Legislative.gov.in for Act texts
- Supreme Court and High Court judgments
- Ministry websites (lawmin.gov.in, labour.gov.in)
- RBI guidelines for banking scenarios
- Consumer court databases

**Content Verification Process**:
1. Research legal framework for each scenario
2. Cross-reference multiple government sources
3. Generate natural language variations through user research
4. Legal professional review (mandatory before publication)
5. Automated link verification system

## Architecture Decisions

### Search Implementation
**Client-Side Processing**: All search happens in browser
- Pre-computed embeddings loaded with page
- Real-time similarity calculation using cosine similarity
- No server required, maintains privacy
- Instant results (<200ms target)

### Performance Optimization
**Bundle Splitting**: 
- Core app bundle (~50KB gzipped)
- Embeddings loaded asynchronously (~200KB)
- Scenarios loaded on-demand or cached

**Caching Strategy**:
- Service Worker for offline capability
- Browser cache for embeddings and core content
- CDN caching for static assets

### Content Management
**Development Workflow**:
1. Content creation in markdown/JSON format
2. Embedding generation during build process
3. Static site generation with pre-computed search data
4. Automated source verification during CI/CD
5. Manual legal review gate before deployment

## User Experience Research

### Search Behavior Analysis
**Primary User Patterns**:
- Natural language descriptions of problems
- Mix of formal and colloquial terms
- Often include emotional context ("boss is cheating me")
- Expect immediate, relevant results

**Search Query Examples** (per scenario):
- Salary: "boss not paying", "company owes money", "salary delayed"
- Harassment: "workplace harassment", "inappropriate behavior at work"
- Consumer: "defective product", "shop won't return money", "fake goods"

### UI/UX Design Principles
**Professional Appearance Requirements**:
- Clean, trustworthy design (reference: Vakilsearch, LegalKart)
- Clear information hierarchy
- Prominent source citations for credibility
- Mobile-first responsive design
- Minimal cognitive load for users in distress

**Accessibility Considerations**:
- High contrast ratios for readability
- Large touch targets for mobile
- Clear navigation for screen readers
- Simple language avoiding legal jargon
- Offline functionality for areas with poor connectivity

## Risk Mitigation Research

### Legal Liability Protection
**Disclaimer Strategy**:
- Clear information vs advice distinction
- Prominent disclaimers without being intimidating
- Recommendation to consult lawyers for specific cases
- Terms of service protecting platform liability

### Content Accuracy Assurance
**Verification Pipeline**:
1. Multiple government source cross-referencing
2. Legal professional review mandatory
3. Regular content auditing (quarterly)
4. Automated link checking (daily)
5. User feedback system for reporting errors

### Technical Risk Management
**Performance Monitoring**:
- Real User Monitoring (RUM) for actual performance
- Search accuracy tracking through user behavior
- A/B testing for search algorithm improvements
- Error tracking and monitoring

## MVP Implementation Priorities

### Phase 1: Core Foundation (Days 1-2)
- Next.js project setup with TypeScript
- Basic search infrastructure
- Embedding generation pipeline
- Content schema implementation

### Phase 2: Content Creation (Days 3-4)
- 10 priority scenarios with full content
- Natural language variation generation
- Government source verification
- Legal professional review process

### Phase 3: UI Polish (Days 5-6)
- Professional design implementation
- Mobile optimization
- PWA features and offline capability
- Citation display system

### Phase 4: Testing & Deployment (Day 7+)
- User testing with 20+ participants
- Performance optimization
- Source verification audit
- Public deployment

## Success Metrics Definition

**Technical Metrics**:
- Search accuracy: 80%+ relevant results in top 3
- Performance: <3s load time, <200ms search
- Availability: 99%+ uptime after deployment

**User Experience Metrics**:
- Task completion: 70%+ complete scenario + actions
- Professional quality: 4.0+ rating vs competitors
- Source trust: Users click and verify government links

**Content Quality Metrics**:
- Source verification: 100% government attribution
- Legal accuracy: Zero reported factual errors
- Coverage: 10 scenarios handle 80%+ common situations

## Technical Dependencies

**Core Dependencies**:
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "sentence-transformers": "via Python build script"
}
```

**Development Tools**:
- GitHub Actions for CI/CD
- Vercel for deployment
- Playwright for E2E testing
- Jest for unit testing

**Content Processing**:
- Python scripts for embedding generation
- Automated link checking tools
- Content management scripts

## Conclusion
Research validates technical feasibility of semantic search approach with client-side processing. Content strategy focuses on central laws to reduce complexity. Professional UI requirements are achievable with modern web technologies. Legal risk mitigation through comprehensive disclaimers and source verification is well-defined.