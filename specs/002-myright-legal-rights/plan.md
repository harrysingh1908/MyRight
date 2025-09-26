
# Implementation Plan: MyRight Legal Rights Discovery Platform

**Branch**: `002-myright-legal-rights` | **Date**: 2025-09-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/home/harry/MyRight/specs/002-myright-legal-rights/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 9. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md  
- Phase 3-4: Implementation execution (manual or via tools)

**STATUS**: ✅ PLAN EXECUTION COMPLETE - Ready for /tasks command

## Summary
MyRight is a legal rights discovery platform enabling Indian citizens to quickly find relevant legal information through intelligent semantic search. Users can search using natural language ("boss not paying salary") and get matched to appropriate scenarios with verified government sources, legal citations, and actionable steps. The platform focuses on 10 priority legal scenarios with PWA architecture for offline access and professional UI quality matching established legal services.

## Technical Context
**Language/Version**: TypeScript/JavaScript with Node.js 18+, React 18+ with Next.js 14+  
**Primary Dependencies**: Next.js (static generation), sentence-transformers (all-MiniLM-L6-v2), React, Tailwind CSS for styling  
**Storage**: Static JSON files for content, pre-computed embeddings, no database required  
**Testing**: Jest for unit testing, Playwright for E2E testing, manual user testing for search accuracy  
**Target Platform**: Web browsers (mobile-first responsive), deployed as static site with PWA capabilities
**Project Type**: Web application (frontend-focused with static generation)  
**Performance Goals**: <3 second page load on 3G, <200ms search response time, 80%+ search accuracy  
**Constraints**: Client-side processing only, offline capability required, no personal data storage, 100% government source verification  
**Scale/Scope**: 10-20 initial users for MVP validation, 10 legal scenarios, semantic search with 10-15 variations per scenario

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. ACCESSIBILITY FIRST ✅
- Plain language explanations for all legal content (built into content structure)
- Mobile-optimized responsive design with Next.js (specified in technical approach)
- Offline functionality via PWA and service worker implementation
- Simple explanations for legal terms integrated into scenario content

### II. SOURCE CREDIBILITY (NON-NEGOTIABLE) ✅
- Every legal claim backed by verified government sources (.gov.in websites, court judgments)
- Citation format standardized: "According to [Legal Act/Section], you have the right to... [Source Link]"
- Automated daily link checking + quarterly manual review process
- 100% government source verification requirement before publication

### III. SITUATION-BASED APPROACH ✅
- Primary navigation via real-life scenarios, not legal categories
- Semantic search enables natural language queries ("boss didn't pay me" → unpaid salary)
- 10 priority scenarios based on common citizen problems
- Step-by-step actions within specific contexts

### IV. NO LEGAL ADVICE BOUNDARY ✅
- Clear disclaimers throughout: "This provides legal information, not legal advice"
- Information-only approach with recommendation to consult qualified lawyers
- No personalized case recommendations or legal consultation features
- Terms of service protecting platform from legal liability

### V. INCLUSIVE DESIGN ✅
- Works on basic smartphones with 3G connections (<3 second load time)
- WCAG 2.1 AA accessibility compliance planned
- Professional appearance matching established legal platforms
- Content tested with diverse user groups (college students to elderly)

**Constitution Compliance Status**: ✅ PASS - All principles addressed in technical approach

## Project Structure

### Documentation (this feature)
```
specs/002-myright-legal-rights/
├── plan.md              # ✅ This file (/plan command output)
├── research.md          # ✅ Phase 0 output (/plan command)
├── data-model.md        # ✅ Phase 1 output (/plan command)
├── quickstart.md        # ✅ Phase 1 output (/plan command)
├── contracts/           # ✅ Phase 1 output (/plan command)
│   ├── search-service.md    # ✅ Semantic search API contract
│   ├── content-service.md   # ✅ Content management contract  
│   └── ui-components.md     # ✅ React/Next.js UI contract
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code Structure (Next.js Web Application)
```
myright-platform/
├── src/
│   ├── app/                 # Next.js 13+ app directory
│   │   ├── page.tsx        # Home page with search
│   │   ├── search/         # Search results page
│   │   └── scenario/       # Scenario detail pages
│   ├── components/
│   │   ├── search/         # Search interface components
│   │   ├── content/        # Scenario display components
│   │   └── ui/            # Reusable UI components
│   ├── services/
│   │   ├── searchService.ts    # Semantic search logic
│   │   ├── contentService.ts   # Content management
│   │   └── embeddingService.ts # Vector processing
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces
│   └── data/
│       ├── scenarios/      # JSON scenario files
│       └── embeddings/     # Pre-computed vectors
├── public/
│   ├── data/              # Static content files
│   └── icons/             # Category icons
├── scripts/
│   └── embeddings/        # Python embedding generation
└── tests/
    ├── unit/              # Component unit tests
    ├── integration/       # Service integration tests
    └── e2e/              # End-to-end testing
```

## Implementation Phases

### Phase 0: Research & Architecture ✅ COMPLETED
- ✅ Technology stack research and decisions
- ✅ Content architecture design  
- ✅ Legal risk mitigation strategy
- ✅ Performance and accessibility requirements
- ✅ User experience research and design principles

### Phase 1: Design Contracts ✅ COMPLETED  
- ✅ Data model design with TypeScript interfaces
- ✅ Search service API contract with semantic search requirements
- ✅ Content service contract with source verification
- ✅ UI component specifications with accessibility standards
- ✅ QuickStart development guide for rapid setup

### Phase 2: Task Generation Planning 🎯 READY
**Approach**: The implementation will follow TDD principles with contract-first development:

1. **Setup & Foundation Tasks** (T001-T010)
   - Next.js project initialization with TypeScript
   - Core type definitions from data-model.md
   - Basic service skeleton implementations
   - Development environment configuration

2. **Content System Tasks** (T011-T025)
   - JSON schema implementation for scenarios
   - Content loading and validation services  
   - Source verification system with automated checking
   - Sample scenario creation (5 scenarios minimum for MVP)

3. **Search Engine Tasks** (T026-T040)
   - Embedding generation pipeline (Python script)
   - Semantic similarity matching implementation
   - Search interface with auto-complete
   - Result ranking and confidence scoring

4. **UI Implementation Tasks** (T041-T060)
   - Professional design system implementation
   - Search interface with accessibility features
   - Scenario detail pages with source attribution
   - Category navigation and mobile optimization

5. **Content Creation Tasks** (T061-T080)
   - 10 priority legal scenarios with full content
   - Natural language variation generation (AI-assisted)
   - Government source verification and citation
   - Legal professional content review integration

6. **Testing & Polish Tasks** (T081-T100)
   - Unit tests for all services and components
   - Integration testing for search accuracy
   - Performance optimization and PWA features
   - User acceptance testing and deployment preparation

**Success Criteria for /tasks execution**:
- All contracts have corresponding implementation tasks
- TDD approach with tests written before implementation
- Constitutional compliance verification at each phase
- Performance benchmarks integrated into task definitions
- Legal review and source verification built into workflow

### Phase 3-4: Implementation Execution (Manual/Assisted)
**Note**: These phases executed outside /plan command scope
- Task execution with GitHub Copilot assistance
- Iterative development with constitutional compliance checking
- User testing and feedback integration
- Production deployment and monitoring setup

## Progress Tracking

### Constitution Check Status
- ✅ **Initial Constitution Check**: All principles addressed in technical approach
- 🔄 **Post-Design Constitution Check**: Validated through contract specifications
- ✅ **Source Credibility**: Government source verification system designed
- ✅ **Accessibility**: WCAG 2.1 AA compliance planned in UI contracts
- ✅ **Situation-Based**: Semantic search enables natural language queries
- ✅ **Legal Boundary**: Clear disclaimers and information-only approach
- ✅ **Inclusive Design**: Mobile-first, professional quality standards

### Complexity Tracking
**Justified Complexity**:
- **Semantic Search**: Required for constitutional "situation-based approach" - users must find rights through natural language, not legal categories
- **Source Verification**: Required for constitutional "source credibility" - every legal claim must be verifiable
- **Professional UI**: Required for constitutional "inclusive design" - platform must serve all citizens effectively

**Complexity Mitigation**:
- Client-side processing eliminates server infrastructure
- Pre-computed embeddings avoid runtime ML complexity  
- Static site generation ensures performance and reliability
- Proven libraries (Next.js, sentence-transformers) reduce custom development

### Risk Mitigation Status
- ✅ **Legal Liability**: Comprehensive disclaimer strategy and content review process
- ✅ **Search Effectiveness**: Semantic search with 80%+ accuracy targets and fallback strategies
- ✅ **Technical Complexity**: Simplified to client-side processing with proven technologies
- ✅ **Content Quality**: Structured verification pipeline with automated and manual checks

**Ready for /tasks command execution** ✅

**Structure Decision**: [DEFAULT to Option 1 unless Technical Context indicates web/mobile app]

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [ ] Phase 0: Research complete (/plan command)
- [ ] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [ ] Initial Constitution Check: PASS
- [ ] Post-Design Constitution Check: PASS
- [ ] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
