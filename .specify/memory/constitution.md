<!--
Sync Impact Report - Constitution Update
Version: 0.0.0 → 1.0.0 (MAJOR: Initial constitution creation)
Modified Principles: All principles created from scratch
Added Sections: 
- Core Principles (5 principles)
- Technical Standards
- Quality Standards  
- Governance
Templates Requiring Updates: 
✅ .specify/templates/plan-template.md (validated for principle alignment)
⚠ .specify/templates/spec-template.md (pending validation)
⚠ .specify/templates/tasks-template.md (pending validation)
Follow-up TODOs: None - all placeholders filled
-->

# MyRight Constitution

## Core Principles

### I. ACCESSIBILITY FIRST
Legal information MUST be presented in plain language accessible to all education levels. The platform MUST function offline for basic rights lookup, be mobile-optimized, and work on low-bandwidth connections. Every legal term MUST have a simple explanation. Information architecture MUST prioritize common scenarios over legal complexity.

**Rationale**: Legal rights are meaningless if citizens cannot understand or access them. India's diverse population requires universal design principles.

### II. SOURCE CREDIBILITY (NON-NEGOTIABLE)
Every legal right, procedure, or claim MUST be backed by verifiable official sources: government websites, court judgments, Acts of Parliament, or verified legal documents. All content MUST include direct links or citations to original sources. No information may be published without official source verification.

**Rationale**: Misinformation about legal rights can cause serious harm. Citizens must be able to verify all information independently.

### III. SITUATION-BASED APPROACH
Users MUST find rights through real-life scenarios, not legal categories. The primary navigation MUST be based on common situations (workplace, consumer, housing, police, family, digital). Legal procedures MUST be explained as step-by-step actions within specific contexts.

**Rationale**: Citizens think in terms of problems they face, not legal frameworks. Situation-first design reduces cognitive load.

### IV. NO LEGAL ADVICE BOUNDARY
The platform MUST provide legal information and sources only, never personalized legal advice. All content MUST include clear disclaimers. No feature may simulate lawyer consultation or provide case-specific recommendations. Users MUST be directed to qualified legal professionals for personalized advice.

**Rationale**: Crossing into legal advice creates liability and regulatory risks while potentially harming users who need qualified counsel.

### V. INCLUSIVE DESIGN
The platform MUST serve users from college students to elderly citizens, urban to rural contexts. All features MUST work on basic smartphones. Language MUST avoid legal jargon. Visual design MUST follow accessibility standards (WCAG 2.1 AA minimum). Offline functionality MUST be available for essential information.

**Rationale**: Digital divide and varying tech literacy require inclusive design to serve all Indian citizens effectively.

## Technical Standards

**Open Source First**: All code MUST be open source with appropriate licenses. External costs MUST be minimized through preference for free/open tools and services.

**Progressive Web App Architecture**: Platform MUST function as PWA supporting both mobile and desktop. Core functionality MUST work offline. Performance MUST meet lighthouse standards (90+ scores).

**AI Integration**: AI-powered features (situation matching, plain language generation) MUST have human oversight. AI responses MUST cite official sources. No AI-generated legal content without source verification.

**API Integration**: Government APIs MUST be used where available. Web scraping of official sources MUST include proper attribution and rate limiting. Data freshness MUST be tracked and displayed.

## Quality Standards

**60-Second Rule**: Users MUST be able to find relevant rights information within 60 seconds of landing on the platform. Navigation paths MUST be tested and optimized for this target.

**Professional Presentation**: Design and content MUST meet professional standards suitable for nationwide launch. No placeholder content, broken links, or amateur presentation.

**Source Verification**: Every piece of information MUST have a verifiable trail to official sources. Source links MUST be tested regularly for availability.

**Performance Standards**: Platform MUST handle nationwide traffic loads. Core pages MUST load under 3 seconds on 3G connections.

## Privacy & Legal Protection

**No Personal Data Storage**: Platform MUST NOT store personal user data beyond session requirements. No user accounts, personal case details, or tracking beyond basic analytics.

**Legal Liability Protection**: All content MUST include appropriate disclaimers. Platform design MUST clearly distinguish information from advice. Terms of service MUST protect against misuse.

**Content Accuracy**: Information MUST be accurate as of September 2025. Update mechanisms MUST be planned for future content maintenance.

## Governance

This constitution supersedes all other development practices and decisions. All feature specifications, code reviews, and releases MUST verify compliance with these principles.

**Amendment Process**: Constitutional changes require documentation of rationale, impact analysis on existing features, and migration plan for affected systems. Major principle changes require version bump and stakeholder review.

**Compliance Review**: All pull requests MUST include constitution compliance verification. Feature complexity MUST be justified against accessibility and inclusive design principles.

**Quality Gates**: No feature may ship without source verification, accessibility testing, and performance validation against stated standards.

**Version**: 1.0.0 | **Ratified**: 2025-09-25 | **Last Amended**: 2025-09-25