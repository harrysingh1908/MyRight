# Tasks: MyRight Legal Rights Discovery Platform

**Input**: Design documents from `/home/harry/MyRight/specs/002-myright-legal-rights/`
**Prerequisites**: ✅ plan.md, ✅ research.md, ✅ data-model.md, ✅ contracts/

## Execution Flow (main)
```
1. ✅ Load plan.md from feature directory → Next.js web app with TypeScript, semantic search
2. ✅ Load optional design documents:
   → data-model.md: 8 entities identified → model tasks generated
   → contracts/: 3 services identified → contract test tasks generated  
   → research.md: Technology stack decisions → setup tasks generated
3. ✅ Generate tasks by category:
   → Setup: Next.js project, TypeScript, dependencies, linting
   → Tests: Search service, content service, UI component tests
   → Core: Data models, services, embedding generation
   → Integration: Search pipeline, content loading, UI assembly
   → Polish: Performance optimization, PWA features, deployment
4. ✅ Apply task rules:
   → Different files = mark [P] for parallel execution
   → Same file = sequential (no [P]) to avoid conflicts
   → Tests before implementation (TDD approach)
5. ✅ Number tasks sequentially (T001-T085)
6. ✅ Generate dependency graph and parallel execution examples
7. ✅ Validate task completeness: All contracts, entities, and user stories covered
8. ✅ Return: SUCCESS (85 tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions (Next.js Web Application)
```
myright-platform/
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── services/      # Business logic services
│   ├── types/         # TypeScript interfaces
│   └── data/          # Static content files
├── public/            # Static assets
├── scripts/           # Build and utility scripts
└── tests/             # Test files
```

## Phase 3.1: Project Setup & Foundation
- [ ] **T001** Initialize Next.js project with TypeScript in `myright-platform/`
- [ ] **T002** [P] Install core dependencies: Next.js 14+, React 18+, TypeScript, Tailwind CSS
- [ ] **T003** [P] Install development dependencies: Jest, Playwright, ESLint, Prettier
- [ ] **T004** [P] Configure ESLint and Prettier for code quality
- [ ] **T005** Create project directory structure matching plan.md specifications
- [ ] **T006** [P] Configure Tailwind CSS with accessibility-focused design system
- [ ] **T007** [P] Set up TypeScript configuration with strict mode enabled
- [ ] **T008** [P] Configure Jest for unit testing with React Testing Library
- [ ] **T009** [P] Set up Playwright for end-to-end testing
- [ ] **T010** Create environment configuration files (.env.local, .env.example)

## Phase 3.2: Type Definitions & Models (TDD Foundation) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These interfaces MUST be defined before ANY service implementation**
- [ ] **T011** [P] Core types in `src/types/index.ts` - LegalScenario, LegalRight, ActionStep interfaces
- [ ] **T012** [P] Search types in `src/types/search.ts` - SearchResult, SearchResponse, SearchConfig interfaces
- [ ] **T013** [P] Content types in `src/types/content.ts` - Category, OfficialSource, ValidationResult interfaces
- [ ] **T014** [P] UI component prop types in `src/types/components.ts` - All React component interfaces
- [ ] **T015** Create sample data structure in `src/data/scenarios/salary-unpaid.json`
- [ ] **T016** [P] Create categories definition file in `src/data/categories.json`
- [ ] **T017** [P] Create embedding data structure in `src/data/embeddings/sample-embeddings.json`

## Phase 3.3: Contract Tests (TDD) ⚠️ MUST COMPLETE BEFORE 3.4 AND MUST FAIL
**CRITICAL: These tests MUST be written and MUST FAIL before ANY service implementation**
- [ ] **T018** [P] SearchService contract test in `tests/contract/test_search_service.test.ts`
- [ ] **T019** [P] ContentService contract test in `tests/contract/test_content_service.test.ts`
- [ ] **T020** [P] UI Components contract test in `tests/contract/test_ui_components.test.tsx`
- [ ] **T021** [P] Integration test: Complete search flow in `tests/integration/test_search_flow.test.ts`
- [ ] **T022** [P] Integration test: Content loading and validation in `tests/integration/test_content_loading.test.ts`
- [ ] **T023** [P] Integration test: Scenario display with sources in `tests/integration/test_scenario_display.test.tsx`

## Phase 3.4: Core Service Implementation (ONLY after tests are failing)
### Search Engine Services
- [ ] **T024** [P] SearchService base class in `src/services/searchService.ts` (initialize, basic structure)
- [ ] **T025** [P] EmbeddingService for vector processing in `src/services/embeddingService.ts`
- [ ] **T026** Semantic similarity matching algorithm in `src/services/searchService.ts` (search method)
- [ ] **T027** Auto-complete suggestions system in `src/services/searchService.ts` (getSuggestions method)
- [ ] **T028** Category-based browsing logic in `src/services/searchService.ts` (getScenariosByCategory)

### Content Management Services  
- [ ] **T029** [P] ContentService base class in `src/services/contentService.ts` (initialization, loading)
- [ ] **T030** [P] Source validation service in `src/services/sourceValidator.ts`
- [ ] **T031** Content loading and parsing logic in `src/services/contentService.ts` (getScenario, getCategories)
- [ ] **T032** Content validation pipeline in `src/services/contentService.ts` (validateSources method)

### Data Processing & Build Tools
- [ ] **T033** [P] Python embedding generation script in `scripts/embeddings/generate_embeddings.py`
- [ ] **T034** [P] Content validation script in `scripts/validation/validate_content.js`
- [ ] **T035** [P] Source link checker script in `scripts/validation/check_sources.js`
- [ ] **T036** Build process integration for embedding generation in `scripts/build/build_embeddings.js`

## Phase 3.5: UI Components Implementation
### Core Search Components
- [ ] **T037** [P] SearchInterface component in `src/components/search/SearchInterface.tsx`
- [ ] **T038** [P] SearchResults component in `src/components/search/SearchResults.tsx`
- [ ] **T039** [P] SearchResult item component in `src/components/search/SearchResult.tsx`
- [ ] **T040** [P] AutoComplete suggestions component in `src/components/search/AutoComplete.tsx`

### Content Display Components
- [ ] **T041** [P] ScenarioDetail component in `src/components/content/ScenarioDetail.tsx`
- [ ] **T042** [P] LegalRights section component in `src/components/content/LegalRights.tsx`
- [ ] **T043** [P] ActionSteps component in `src/components/content/ActionSteps.tsx`
- [ ] **T044** [P] SourceAttribution component in `src/components/content/SourceAttribution.tsx`
- [ ] **T045** [P] RelatedScenarios component in `src/components/content/RelatedScenarios.tsx`

### Navigation & Layout Components
- [ ] **T046** [P] CategoryNavigation component in `src/components/navigation/CategoryNavigation.tsx`
- [ ] **T047** [P] CategoryTile component in `src/components/navigation/CategoryTile.tsx`
- [ ] **T048** [P] AppLayout wrapper component in `src/components/ui/Layout.tsx`
- [ ] **T049** [P] Header component in `src/components/ui/Header.tsx`
- [ ] **T050** [P] LegalDisclaimer component in `src/components/ui/LegalDisclaimer.tsx`

## Phase 3.6: Page Implementation & Integration
- [ ] **T051** Home page with search interface in `src/app/page.tsx`
- [ ] **T052** Search results page in `src/app/search/page.tsx`
- [ ] **T053** Scenario detail page in `src/app/scenario/[id]/page.tsx`
- [ ] **T054** Category browsing page in `src/app/category/[category]/page.tsx`
- [ ] **T055** Service integration in all pages (search + content services)
- [ ] **T056** Error boundary implementation in `src/components/ui/ErrorBoundary.tsx`
- [ ] **T057** Loading states and skeleton components in `src/components/ui/LoadingStates.tsx`

## Phase 3.7: Content Creation & Data Population
### Legal Scenario Content (10 Priority Scenarios)
- [ ] **T058** [P] Salary/wage issues scenario in `src/data/scenarios/employment/salary-unpaid.json`
- [ ] **T059** [P] Security deposit disputes scenario in `src/data/scenarios/housing/security-deposit.json`
- [ ] **T060** [P] Defective product scenario in `src/data/scenarios/consumer/defective-product.json`
- [ ] **T061** [P] Police bribery scenario in `src/data/scenarios/police/bribery-demands.json`
- [ ] **T062** [P] Workplace harassment scenario in `src/data/scenarios/employment/workplace-harassment.json`
- [ ] **T063** [P] Online shopping fraud scenario in `src/data/scenarios/digital/online-shopping-fraud.json`
- [ ] **T064** [P] Wrongful termination scenario in `src/data/scenarios/employment/wrongful-termination.json`
- [ ] **T065** [P] Medical negligence scenario in `src/data/scenarios/consumer/medical-negligence.json`
- [ ] **T066** [P] Domestic violence scenario in `src/data/scenarios/family/domestic-violence.json`
- [ ] **T067** [P] Banking fraud scenario in `src/data/scenarios/digital/banking-fraud.json`

### Content Processing & Embeddings
- [ ] **T068** Generate natural language variations for all scenarios (10-15 per scenario)
- [ ] **T069** Run embedding generation for all scenarios and variations
- [ ] **T070** Validate all government source links and update status
- [ ] **T071** Create optimized embeddings file for production deployment

## Phase 3.8: Performance & Accessibility Polish
### PWA & Performance Features
- [ ] **T072** [P] Service Worker implementation for offline capability in `public/sw.js`
- [ ] **T073** [P] PWA manifest and icons in `public/manifest.json`
- [ ] **T074** Performance optimization: lazy loading, code splitting in Next.js config
- [ ] **T075** [P] Accessibility audit and WCAG 2.1 AA compliance verification
- [ ] **T076** [P] Mobile responsiveness testing and optimization

### Testing & Quality Assurance
- [ ] **T077** [P] Unit tests for all services in `tests/unit/services/`
- [ ] **T078** [P] Unit tests for all components in `tests/unit/components/`
- [ ] **T079** [P] Performance tests: search response time <200ms validation
- [ ] **T080** [P] Cross-browser compatibility testing (Chrome, Firefox, Safari, Mobile)
- [ ] **T081** User acceptance testing with 20+ participants across different scenarios

### Documentation & Deployment
- [ ] **T082** [P] Update README.md with setup instructions and architecture overview
- [ ] **T083** [P] Create deployment configuration for Vercel/Netlify
- [ ] **T084** [P] Set up CI/CD pipeline with automated testing and deployment
- [ ] **T085** Production deployment and monitoring setup

## Dependencies & Execution Order

### Critical Path Dependencies
```
Setup (T001-T010) → Types (T011-T017) → Contract Tests (T018-T023) → Core Services (T024-T036) → UI Components (T037-T050) → Integration (T051-T057) → Content (T058-T071) → Polish (T072-T085)
```

### Detailed Dependency Rules
- **T001-T010** must complete before all other phases (project foundation)
- **T011-T017** must complete before T018-T023 (types needed for contract tests)
- **T018-T023** must complete and FAIL before T024-T036 (TDD requirement)
- **T024-T036** must complete before T051-T057 (services needed for pages)
- **T037-T050** can run parallel with T024-T036 (different files)
- **T058-T067** can run parallel (different content files)
- **T072-T085** require most other tasks complete (polish phase)

### Same-File Conflicts (No Parallel Execution)
- **T024, T026, T027, T028**: All modify `src/services/searchService.ts`
- **T029, T031, T032**: All modify `src/services/contentService.ts`  
- **T051, T055**: Both modify page files that integrate services

## Parallel Execution Examples

### Phase 3.1 Setup (5 parallel streams)
```bash
# Stream 1: Project initialization
Task: "Initialize Next.js project with TypeScript in myright-platform/"
Task: "Create project directory structure matching plan.md specifications"

# Stream 2: Dependencies  
Task: "Install core dependencies: Next.js 14+, React 18+, TypeScript, Tailwind CSS"
Task: "Install development dependencies: Jest, Playwright, ESLint, Prettier"

# Stream 3: Configuration
Task: "Configure ESLint and Prettier for code quality"  
Task: "Configure Tailwind CSS with accessibility-focused design system"
Task: "Set up TypeScript configuration with strict mode enabled"

# Stream 4: Testing setup
Task: "Configure Jest for unit testing with React Testing Library"
Task: "Set up Playwright for end-to-end testing"

# Stream 5: Environment
Task: "Create environment configuration files (.env.local, .env.example)"
```

### Phase 3.2 Types & Models (4 parallel streams)
```bash
# Stream 1: Core domain types
Task: "Core types in src/types/index.ts - LegalScenario, LegalRight, ActionStep interfaces"

# Stream 2: Search types  
Task: "Search types in src/types/search.ts - SearchResult, SearchResponse, SearchConfig interfaces"

# Stream 3: Content types
Task: "Content types in src/types/content.ts - Category, OfficialSource, ValidationResult interfaces"

# Stream 4: Component types
Task: "UI component prop types in src/types/components.ts - All React component interfaces"
```

### Phase 3.3 Contract Tests (6 parallel streams)
```bash
# All contract tests can run in parallel - different files
Task: "SearchService contract test in tests/contract/test_search_service.test.ts"
Task: "ContentService contract test in tests/contract/test_content_service.test.ts"  
Task: "UI Components contract test in tests/contract/test_ui_components.test.tsx"
Task: "Integration test: Complete search flow in tests/integration/test_search_flow.test.ts"
Task: "Integration test: Content loading and validation in tests/integration/test_content_loading.test.ts"
Task: "Integration test: Scenario display with sources in tests/integration/test_scenario_display.test.tsx"
```

### Phase 3.7 Content Creation (10 parallel streams)
```bash
# All scenarios can be created in parallel - different JSON files
Task: "Salary/wage issues scenario in src/data/scenarios/employment/salary-unpaid.json"
Task: "Security deposit disputes scenario in src/data/scenarios/housing/security-deposit.json"
Task: "Defective product scenario in src/data/scenarios/consumer/defective-product.json"
Task: "Police bribery scenario in src/data/scenarios/police/bribery-demands.json"
Task: "Workplace harassment scenario in src/data/scenarios/employment/workplace-harassment.json"
Task: "Online shopping fraud scenario in src/data/scenarios/digital/online-shopping-fraud.json"
Task: "Wrongful termination scenario in src/data/scenarios/employment/wrongful-termination.json"  
Task: "Medical negligence scenario in src/data/scenarios/consumer/medical-negligence.json"
Task: "Domestic violence scenario in src/data/scenarios/family/domestic-violence.json"
Task: "Banking fraud scenario in src/data/scenarios/digital/banking-fraud.json"
```

## Validation Checklist

### All Contracts Have Tests
- ✅ SearchService: T018 (contract test)
- ✅ ContentService: T019 (contract test)  
- ✅ UI Components: T020 (contract test)

### All Entities Have Models  
- ✅ LegalScenario: T011 (core types)
- ✅ LegalRight: T011 (core types)
- ✅ ActionStep: T011 (core types)
- ✅ OfficialSource: T013 (content types)
- ✅ Category: T013 (content types)
- ✅ SearchResult: T012 (search types)

### All User Stories Have Integration Tests
- ✅ Search for legal rights: T021 (complete search flow)
- ✅ Browse by category: T022 (content loading)
- ✅ View scenario details: T023 (scenario display)

### Constitutional Compliance Integration
- ✅ Source Credibility: T030, T032, T070 (source validation throughout)
- ✅ Accessibility: T075 (WCAG compliance verification)
- ✅ Situation-Based: T024-T028 (semantic search implementation)
- ✅ Professional Quality: T074, T076, T080 (performance and cross-browser testing)

## Notes
- **[P] tasks**: Different files, can execute in parallel
- **Sequential tasks**: Same file modifications, must execute in order
- **TDD Critical**: Tests (T018-T023) MUST fail before implementation begins
- **Performance Gates**: T079 validates <200ms search response requirement
- **Constitutional Gates**: T075 validates accessibility compliance
- **Quality Gates**: T081 validates user experience with real testing

## Success Criteria
- All 85 tasks executable by LLM without additional context
- TDD approach ensures quality and contract compliance  
- Parallel execution reduces development time by ~60%
- Constitutional compliance verified at multiple checkpoints
- Production-ready legal rights platform with professional quality