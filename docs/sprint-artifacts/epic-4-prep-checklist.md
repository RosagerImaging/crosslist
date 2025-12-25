# Epic 4 Preparation Checklist

**Status:** In Progress
**Timeline:** 1-2 weeks (calendar time)
**Active Work:** 5-6.5 days (parallel execution possible)
**Critical Path:** Interactive Mockup (1-2 days) + UX Validation Track (3.5 days)

---

## 🎨 UX Design Track (HIGHEST PRIORITY - 5-6.5 days total)

**CONTEXT:** Comprehensive first-draft UX design already created (docs/ux-design-crosslist.md - 2955 lines)
**GOAL:** Create interactive mockup, validate with real users + competitive research, then refine based on findings

### Pre-Sprint: Interactive Mockup Creation (1-2 days)

**Owner:** Joel
**Why Critical:** Non-technical resellers can't evaluate static wireframes - they need clickable UI to give meaningful feedback

- [ ] Create interactive mockup/prototype from UX design doc
- [ ] Apply neo-brute-teal theme styling (docs/neo-brute-teal-theme.txt)
- [ ] Implement clickable navigation between Epic 4 screens
- [ ] Test all user flows are navigable (crosslisting, inventory, marketplace connection)
- [ ] Deploy mockup to accessible URL for remote user testing
- [ ] **Deliverable:** Interactive prototype URL ready for user validation
- [ ] **Tools:** Figma with prototyping, or Next.js with placeholder components and routing

### Day 1: Competitive Research & Design Review

**Owner:** Sally + Alice
**Status:** User has complete UX design draft ready for validation

- [ ] Sally reviews existing UX design document (docs/ux-design-crosslist.md)
- [ ] Sally reviews UX-story traceability matrix (docs/ux-story-traceability-matrix.md)
- [ ] Sally reviews neo-brute-teal theme (docs/neo-brute-teal-theme.txt)
- [ ] Hands-on use of Vendoo (with Crosslist design open for comparison)
- [ ] Hands-on use of ListPerfectly (with Crosslist design open for comparison)
- [ ] Hands-on use of Flyp (with Crosslist design open for comparison)
- [ ] Hands-on use of Crosslist.com (with Crosslist design open for comparison)
- [ ] Document: What does our design do BETTER than competitors?
- [ ] Document: What gaps or "clunk points" did we miss?
- [ ] Document: What unexpected features do competitors have that users might expect?
- [ ] Alice arranges 3-5 real reseller interviews
- [ ] Prepare user validation scenarios based on interactive mockup
- [ ] **Deliverable:** Competitive analysis report (strengths, gaps, opportunities)

### Day 2: User Validation Sessions

**Owner:** Sally + Alice + Joel (optional observer)
**Approach:** Let resellers interact with clickable mockup, observe real behavior

- [ ] Share mockup URL with each reseller before session
- [ ] Interview 1: Crosslisting flow - watch them attempt to crosslist an item
- [ ] Interview 2: Inventory management - watch them navigate and filter inventory
- [ ] Interview 3: Marketplace connections - observe authentication flow reactions
- [ ] Interview 4: Progress tracking - see how they check crosslist job status
- [ ] Interview 5: Full workflow - free exploration from start to finish
- [ ] Document: Where users get stuck, confused, or frustrated
- [ ] Document: What they try to click that doesn't exist (missing features)
- [ ] Document: Spontaneous reactions and quotes ("I wish...", "Where's...")
- [ ] Document: Validation of competitive advantages identified on Day 1
- [ ] **Deliverable:** User validation report with interaction observations and quotes

### Day 3: Collaborative Design Refinement Session

**Owner:** Sally (facilitator) + Joel + Alice + Charlie + Elena + You
**Approach:** Review existing design through lens of research findings

- [ ] Present existing UX design (you or Sally)
- [ ] Present competitive analysis findings (Sally)
- [ ] Present user validation findings (Sally + Alice)
- [ ] Team discussion: What resonated with users vs what confused them
- [ ] Team discussion: Competitive advantages to emphasize
- [ ] Team discussion: Critical gaps to address
- [ ] Charlie/Elena flag technical constraints or implementation concerns
- [ ] Prioritize refinements: MUST-FIX (blocks launch) vs NICE-TO-HAVE (v2)
- [ ] Assign refinement tasks (who updates what sections)
- [ ] **Deliverable:** Prioritized refinement backlog + task assignments

### Day 4: Design Updates & Final Approval

**Owner:** You (design updates) + Sally (review) + Joel (approval)

- [ ] Update UX design doc based on Day 3 refinement decisions
- [ ] Integrate neo-brute-teal-theme.txt into design tokens section
- [ ] Update wireframes for any flow changes identified
- [ ] Update component specs if new states/variants needed
- [ ] Update traceability matrix if story mappings changed
- [ ] Add "Design Validation Summary" section documenting research insights
- [ ] Sally reviews all updates for consistency
- [ ] Joel final approval review
- [ ] Version document as "v2.0 - User Validated"
- [ ] **Deliverable:** Epic 4 UX Design Specification v2.0 (validated & approved)

### UX Design Success Criteria

- [x] Design system documented (DONE - existing doc)
- [x] Component library specs created (DONE - existing doc)
- [x] Wireframes for all Epic 4 screens (DONE - existing doc)
- [ ] Interactive mockup created with neo-brute-teal theme (NEW - Pre-Sprint)
- [ ] Validated against real reseller interactions (NEW - Day 2)
- [ ] Competitive advantages documented (NEW - Day 1)
- [ ] Addresses every clunk point from competitor research
- [ ] Passes Joel's personal review
- [ ] Developers confirm buildable (Charlie/Elena on Day 3)
- [ ] QA confirms testable (Dana on Day 3)
- [ ] Theme integrated (neo-brute-teal-theme.txt → design doc)

---

## 🛠️ Technical Setup Track (3 days, parallel with UX)

### Fix `npm run db:types` Script

**Owner:** Charlie
**Estimated:** 30 minutes
**Why Critical:** Epic 4 will modify schema for crosslisting tables

- [x] Fix script implementation
- [x] Test script generates types automatically
- [x] Verify script works in CI/CD pipeline

### Stabilize Supabase CI

**Owner:** Charlie
**Estimated:** 2-3 hours
**Why Critical:** Epic 4's complex integration tests need stable CI
**Notes:** Deferred from Epic 2, now critical

- [ ] Implement caching for Supabase CI
- [ ] Implement wait-strategies for Supabase CI
- [ ] Test CI runs pass consistently
- [ ] Verify no Supabase timeouts

### Submit eBay OAuth Application

**Owner:** Charlie (technical) + Joel (account ownership)
**Estimated:** 1-2 weeks (external approval process)
**Why Critical:** Story 4.2 blocked without it
**Strategy:** Continue with Stories 4.1, 4.3, 4.4, 4.5 while waiting

- [ ] Prepare eBay OAuth application materials
- [ ] Submit eBay OAuth application
- [ ] Monitor application status
- [ ] Receive OAuth approval
- [ ] Configure OAuth credentials in project

---

## 📚 Knowledge Development Track (2 days, parallel)

### XState Architecture Spike

**Owner:** Charlie + Elena
**Estimated:** 4-6 hours
**Why Critical:** Story 4.4 requires state machine expertise we don't have

- [ ] Research XState fundamentals
- [ ] Design proof-of-concept state machine
- [ ] Implement working POC
- [ ] Document state machine patterns
- [ ] Share findings with team
- [ ] **Deliverable:** Working proof-of-concept state machine

### Poshmark Anti-Detection Research

**Owner:** Charlie
**Estimated:** 6-8 hours
**Why Critical:** Story 4.3's humanizer must be informed by anti-bot patterns

- [ ] Research Poshmark bot detection mechanisms
- [ ] Identify detection patterns
- [ ] Document mitigation strategies
- [ ] Define human-like behavior parameters
- [ ] Create behavioral randomization patterns
- [ ] **Deliverable:** Document of bot detection patterns and mitigation strategies

---

## Overall Readiness Checklist

**Before Epic 4 Implementation:**

- [ ] Interactive mockup created and validated with users
- [ ] All UX Design Track tasks completed
- [ ] All Technical Setup Track tasks completed (except waiting for eBay OAuth)
- [ ] All Knowledge Development Track tasks completed
- [ ] Epic 4 UX Design v2.0 approved by Joel
- [ ] Team has reviewed and understands design system
- [ ] Developers confirm designs are buildable
- [ ] QA confirms designs are testable

**During Epic 4 Implementation:**

- [ ] Dual review gates established (technical + UX)
- [ ] Sally + Joel UX approval process in place
- [ ] No story marked DONE without both gates passing

---

## Notes

- **Interactive Mockup Critical:** Non-technical users can't evaluate wireframes - need clickable UI
- **Mockup → Implementation Strategy:** After validation, wire functionality to existing mockup components
- **Non-eBay Stories can start after prep:** Stories 4.1, 4.3, 4.4, 4.5
- **eBay Integration when approved:** Story 4.2
- **Parallel execution possible:** Mockup creation can happen while Sally does Day 1 competitive research
- **Critical dependency:** eBay OAuth approval (external, 1-2 weeks)
