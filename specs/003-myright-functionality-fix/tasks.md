# Tasks: MyRight Platform Functionality Implementation

**Input**: Design documents from `/specs/003-myright-functionality-fix/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5.0+ with Next.js 15, React 18+
   → Structure: Enhance existing myright-platform/ (no new structure needed)
2. Load optional design documents ✅:
   → data-model.md: 10 entities (LegalScenario, SearchResult, etc.)
   → contracts/: 3 service contracts (SearchService, ContentService, UI Components)
   → research.md: Client-side semantic search, JSON content storage
3. Generate tasks by category ✅:
   → Setup: Dependencies, data preparation, service stubs
   → Tests: Contract tests for 3 services, integration tests for user flows
   → Core: Service implementations, content data, search functionality
   → Integration: Component wiring, semantic search, UI connections
   → Polish: Performance optimization, error handling, deployment validation
4. Apply task rules ✅:
   → Different files = [P] parallel execution
   → TDD: Tests before implementation
   → Dependencies: Models → Services → Components → Integration
5. Number tasks sequentially (T001, T002...) ✅
6. Generate dependency graph ✅
7. Create parallel execution examples ✅
8. Validate task completeness ✅:
   → All contracts have tests ✅
   → All entities implemented ✅
   → All user flows covered ✅
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Project Structure**: `myright-platform/` (existing Next.js app enhancement)
- **Source**: `myright-platform/src/` 
- **Tests**: `myright-platform/tests/`
- **Data**: `myright-platform/src/data/`

## Phase 3.1: Setup & Dependencies
- [x] T001 Install additional dependencies for semantic search and content processing in myright-platform/package.json
- [x] T002 [P] Create missing legal scenario JSON files structure in myright-platform/src/data/scenarios/
- [x] T003 [P] Initialize embeddings directory and configuration in myright-platform/src/data/embeddings/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Contract test SearchService.search() method in myright-platform/tests/contract/test_search_service_search.test.ts
- [ ] T005 [P] Contract test SearchService.autocomplete() method in myright-platform/tests/contract/test_search_service_autocomplete.test.ts
- [ ] T006 [P] Contract test ContentService.getScenario() method in myright-platform/tests/contract/test_content_service_scenario.test.ts
- [ ] T007 [P] Contract test ContentService.getByCategory() method in myright-platform/tests/contract/test_content_service_category.test.ts
- [ ] T008 [P] Contract test ContentService.validateSources() method in myright-platform/tests/contract/test_content_service_validation.test.ts
- [ ] T009 [P] Integration test: Complete search flow (input → results → detail) in myright-platform/tests/integration/test_search_flow_complete.test.tsx
- [ ] T010 [P] Integration test: Category navigation and filtering in myright-platform/tests/integration/test_category_navigation.test.tsx
- [ ] T011 [P] Integration test: Scenario detail display with sources in myright-platform/tests/integration/test_scenario_detail_display.test.tsx

## Phase 3.3: Core Data & Content (ONLY after tests are failing)
- [ ] T012 [P] Complete employment scenarios JSON data in myright-platform/src/data/scenarios/employment/
- [ ] T013 [P] Complete consumer scenarios JSON data in myright-platform/src/data/scenarios/consumer/
- [ ] T014 [P] Complete housing scenarios JSON data in myright-platform/src/data/scenarios/housing/
- [ ] T015 [P] Complete police scenarios JSON data in myright-platform/src/data/scenarios/police/
- [ ] T016 [P] Complete family scenarios JSON data in myright-platform/src/data/scenarios/family/
- [ ] T017 [P] Complete digital scenarios JSON data in myright-platform/src/data/scenarios/digital/
- [ ] T018 [P] Update categories.json with complete metadata in myright-platform/src/data/categories.json
- [ ] T019 Government source validation and verification for all scenarios in myright-platform/src/data/scenarios/

## Phase 3.4: Service Implementation (Sequential - shared service files)
- [ ] T020 Implement ContentService.getScenario() with JSON loading in myright-platform/src/services/contentService.ts
- [ ] T021 Implement ContentService.getByCategory() with filtering in myright-platform/src/services/contentService.ts  
- [ ] T022 Implement ContentService.getAllScenarios() method in myright-platform/src/services/contentService.ts
- [ ] T023 Implement ContentService.validateSources() with URL checking in myright-platform/src/services/contentService.ts
- [ ] T024 Implement SearchService basic keyword search functionality in myright-platform/src/services/searchService.ts
- [ ] T025 Implement SearchService.autocomplete() with suggestion logic in myright-platform/src/services/searchService.ts
- [ ] T026 Implement SearchService.getSuggestions() for popular searches in myright-platform/src/services/searchService.ts

## Phase 3.5: Component Integration & UI Wiring
- [ ] T027 Wire SearchInterface component to SearchService.search() in myright-platform/src/components/search/SearchInterface.tsx
- [ ] T028 Wire SearchResults component to display SearchService responses in myright-platform/src/components/search/SearchResults.tsx
- [ ] T029 Wire CategoryNavigation to ContentService.getByCategory() in myright-platform/src/components/navigation/CategoryNavigation.tsx
- [ ] T030 Wire ScenarioDetail component to ContentService.getScenario() in myright-platform/src/components/content/ScenarioDetail.tsx
- [ ] T031 Implement search state management in main page component myright-platform/src/app/page.tsx
- [ ] T032 Add error handling and loading states across all components in myright-platform/src/components/

## Phase 3.6: Semantic Search Implementation
- [ ] T033 [P] Generate embeddings for all legal scenarios using sentence-transformers in myright-platform/scripts/generate-embeddings.js
- [ ] T034 [P] Create embedding utility functions for similarity calculation in myright-platform/src/lib/embeddings.ts
- [ ] T035 Integrate semantic search into SearchService.search() method in myright-platform/src/services/searchService.ts
- [ ] T036 Add confidence scoring and fallback to keyword search in myright-platform/src/services/searchService.ts
- [ ] T037 Implement query preprocessing and natural language handling in myright-platform/src/services/searchService.ts

## Phase 3.7: Integration & Polish
- [ ] T038 [P] Add comprehensive error handling for failed searches in myright-platform/src/services/searchService.ts
- [ ] T039 [P] Add comprehensive error handling for content loading failures in myright-platform/src/services/contentService.ts
- [ ] T040 [P] Implement caching layer for search results and content in myright-platform/src/lib/cache.ts
- [ ] T041 Add performance monitoring and metrics collection in myright-platform/src/lib/analytics.ts
- [ ] T042 Implement Progressive Web App caching for offline functionality in myright-platform/public/sw.js
- [ ] T043 [P] Add legal disclaimer component and integration in myright-platform/src/components/ui/LegalDisclaimer.tsx
- [ ] T044 End-to-end functionality testing following myright-platform/specs/003-myright-functionality-fix/quickstart.md
- [ ] T045 Deploy updated functionality and validate production performance on Vercel

## Dependencies
**Critical Path**: Setup (T001-T003) → Tests (T004-T011) → Data (T012-T019) → Services (T020-T026) → UI Integration (T027-T032) → Semantic Search (T033-T037) → Polish (T038-T045)

### Blocking Dependencies:
- **T004-T011 MUST complete before T020-T037** (TDD: Tests before implementation)
- **T012-T019 blocks T020-T023** (ContentService needs data files)
- **T020-T026 blocks T027-T032** (UI needs working services)
- **T027-T032 blocks T044** (Integration testing needs wired components)
- **T033-T034 blocks T035-T037** (Semantic search needs embeddings)

### Non-blocking (Can run in parallel):
- **T012-T018**: Different scenario category files (can create simultaneously)
- **T004-T011**: Different test files (independent contract and integration tests)
- **T038-T043**: Different utility and component files

## Parallel Execution Examples

### Phase 3.2: Contract Tests (Parallel Launch)
```bash
# Launch all contract tests simultaneously:
Task: "Contract test SearchService.search() method in myright-platform/tests/contract/test_search_service_search.test.ts"
Task: "Contract test SearchService.autocomplete() method in myright-platform/tests/contract/test_search_service_autocomplete.test.ts" 
Task: "Contract test ContentService.getScenario() method in myright-platform/tests/contract/test_content_service_scenario.test.ts"
Task: "Contract test ContentService.getByCategory() method in myright-platform/tests/contract/test_content_service_category.test.ts"
Task: "Contract test ContentService.validateSources() method in myright-platform/tests/contract/test_content_service_validation.test.ts"
```

### Phase 3.3: Content Creation (Parallel Launch)  
```bash
# Launch scenario data creation simultaneously:
Task: "Complete employment scenarios JSON data in myright-platform/src/data/scenarios/employment/"
Task: "Complete consumer scenarios JSON data in myright-platform/src/data/scenarios/consumer/"
Task: "Complete housing scenarios JSON data in myright-platform/src/data/scenarios/housing/"
Task: "Complete police scenarios JSON data in myright-platform/src/data/scenarios/police/"
Task: "Complete family scenarios JSON data in myright-platform/src/data/scenarios/family/"
Task: "Complete digital scenarios JSON data in myright-platform/src/data/scenarios/digital/"
```

### Phase 3.7: Utility Implementation (Parallel Launch)
```bash
# Launch utility and polish tasks simultaneously:
Task: "Add comprehensive error handling for failed searches in myright-platform/src/services/searchService.ts"
Task: "Add comprehensive error handling for content loading failures in myright-platform/src/services/contentService.ts"
Task: "Implement caching layer for search results and content in myright-platform/src/lib/cache.ts"
Task: "Add legal disclaimer component and integration in myright-platform/src/components/ui/LegalDisclaimer.tsx"
```

## Notes
- **[P] tasks** = different files, no shared dependencies
- **Sequential tasks** = modify same service files, must run in order
- **TDD requirement**: All tests (T004-T011) must fail before implementing services (T020-T026)
- **Data dependency**: Legal scenario JSON files must exist before ContentService implementation
- **Integration dependency**: Services must work before UI component wiring
- Commit after each completed task for rollback capability

## Task Generation Rules Applied

### From Contracts (3 service contracts):
- **SearchService**: 3 methods → 3 contract tests (T004, T005, T026)
- **ContentService**: 4 methods → 4 contract tests (T006, T007, T008, T023) 
- **UI Components**: 4 components → 4 integration scenarios (T009, T010, T011, T044)

### From Data Model (10 core entities):
- **LegalScenario**: 6 categories × JSON files → 6 content tasks (T012-T017)
- **Category**: Category metadata → 1 metadata task (T018)
- **EmbeddingVector**: Semantic search → 4 embedding tasks (T033-T037)

### From User Stories (Quickstart scenarios):
- **Search flow**: Input → Results → Detail → 1 integration test (T009)
- **Category flow**: Navigation → Filtering → 1 integration test (T010)  
- **Content flow**: Display → Sources → 1 integration test (T011)
- **End-to-end validation**: Complete user journey → 1 validation task (T044)

### Ordering Applied:
- **Setup** (T001-T003) → **Tests** (T004-T011) → **Models/Data** (T012-T019) → **Services** (T020-T026) → **UI** (T027-T032) → **Advanced** (T033-T037) → **Polish** (T038-T045)

## Validation Checklist ✅

- [x] All contracts have corresponding tests (SearchService: T004-T005, ContentService: T006-T008)
- [x] All entities have implementation tasks (LegalScenario: T012-T019, SearchResult: T024-T026)  
- [x] All tests come before implementation (T004-T011 before T020-T037)
- [x] Parallel tasks are truly independent (different files, no shared state)
- [x] Each task specifies exact file path (all tasks include full myright-platform/ paths)
- [x] No [P] task modifies same file as another [P] task (verified no file conflicts)

**SUCCESS**: 45 tasks ready for execution, properly ordered with clear dependencies and parallel opportunities.