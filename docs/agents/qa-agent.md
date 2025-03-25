# 🌴 VIBEZ FOUNDATION: QA Testing Agent Guidelines 🏝️

This document provides essential context and best practices for AI agents working on quality assurance and testing for VIBEZ FOUNDATION.

## 🌊 Project Context

VIBEZ FOUNDATION is a tropical-themed Donor-Advised Fund provider built on Endaoment's DAFs as a Service platform. While the user experience embraces a fun, Caribbean aesthetic, the underlying functionality must be rigorously tested to ensure reliability, security, and compliance in handling philanthropic funds.

## 🧩 Key Responsibilities

As a QA Testing Agent, your primary responsibilities include:

1. Designing and executing comprehensive test plans
2. Identifying and documenting bugs and issues
3. Validating user flows and experiences
4. Testing accessibility compliance
5. Performing security and performance testing
6. Ensuring cross-browser and responsive compatibility
7. Verifying integration with Endaoment's DAAS platform

## 🧪 Testing Strategy

### Testing Pyramid

Follow the testing pyramid approach to ensure comprehensive coverage:

1. **Unit Tests** (Base layer - most numerous)
   - Individual component testing
   - Function and method validation
   - Isolated testing with mocks and stubs

2. **Integration Tests** (Middle layer)
   - API endpoint testing
   - Service interactions
   - Database operations
   - External service integrations

3. **End-to-End Tests** (Top layer - fewest but critical)
   - Complete user journeys
   - Cross-component interactions
   - Real environment testing
   - Browser automation

4. **Special Testing Types** (Complementary)
   - Accessibility testing
   - Performance testing
   - Security testing
   - Visual regression testing

### Critical Test Scenarios

#### User Authentication & Management
- Registration with email
- Social login integration
- Password reset flow
- Profile management
- Account settings
- Session management and timeouts

#### Fund Creation & Management
- Fund creation wizard
- Fund dashboard functionality
- Fund advisor management
- Fund balance and history
- Fund settings and customization

#### Organization Discovery & Donations
- Organization search and filtering
- Organization profile viewing
- Grant recommendation process
- Donation amount selection
- Confirmation and receipts
- Recurring donation setup

#### Impact Tracking
- Donation history visualization
- Impact metrics display
- Reporting and tax documentation
- Social sharing functionality

## 📝 Test Documentation

### Test Plan Template

```markdown
# Test Plan: [Feature Name]

## Overview
[Brief description of the feature being tested]

## Test Environment
- Frontend: [URL]
- Backend: [URL]
- Database: [Configuration]
- Browser/Device Matrix: [List of browsers/devices]

## Test Scenarios
1. [Scenario 1]
   - Preconditions: [What needs to be set up]
   - Steps: [Numbered steps to execute]
   - Expected Results: [What should happen]
   - Test Data: [Sample data to use]

2. [Scenario 2]
   ...

## Risks and Mitigations
- [Identified risk]: [Mitigation strategy]

## Dependencies
- [Feature dependencies]
- [External system dependencies]

## Acceptance Criteria
- [Specific criteria that must be met]
```

### Bug Report Template

```markdown
# Bug Report: [Bug Title]

## Description
[Clear description of the issue]

## Environment
- Browser/Device: [e.g., Chrome 90, iPhone 12]
- OS: [e.g., Windows 11, iOS 15]
- URL: [Where the issue occurred]
- User Type: [e.g., Admin, Regular user]
- Date/Time: [When it was discovered]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]
...

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happened]

## Visual Evidence
[Screenshots, videos, or logs]

## Severity
[Critical/Major/Minor/Trivial]

## Additional Information
[Any other relevant details]
```

## 🔄 Testing Workflows

### New Feature Testing Workflow

1. **Review Documentation**
   - Review PRD and design documents
   - Understand acceptance criteria
   - Identify edge cases and potential risks

2. **Test Planning**
   - Create test scenarios
   - Prepare test data
   - Define test environment

3. **Test Execution**
   - Execute manual tests
   - Run automated tests
   - Document results

4. **Bug Reporting**
   - Report identified issues
   - Provide clear reproduction steps
   - Include visual evidence

5. **Regression Testing**
   - Verify fixes don't introduce new issues
   - Run automated regression suite
   - Validate critical user journeys

6. **Sign-off**
   - Verify acceptance criteria
   - Document test results
   - Provide go/no-go recommendation

### Bug Fix Verification Workflow

1. **Understand the Issue**
   - Review original bug report
   - Check developer's fix notes
   - Understand the root cause

2. **Verification Testing**
   - Reproduce the original issue
   - Verify the fix resolves the issue
   - Test related functionality for side effects

3. **Regression Testing**
   - Run automated tests
   - Test related features manually
   - Verify no new issues introduced

4. **Documentation**
   - Update bug report with verification results
   - Document any caveats or limitations
   - Update test cases if needed

## 🛠️ Testing Tools

### Automated Testing Tools

- **Unit Testing**: Jest, Vitest
- **Component Testing**: React Testing Library, Storybook
- **API Testing**: Supertest, Postman
- **E2E Testing**: Cypress, Playwright
- **Visual Testing**: Percy, Chromatic
- **Accessibility Testing**: axe-core, pa11y
- **Performance Testing**: Lighthouse, WebPageTest

### Manual Testing Tools

- **Browser DevTools**: Chrome/Firefox DevTools
- **Network Monitoring**: Charles Proxy, Fiddler
- **Screen Recording**: Loom, OBS
- **Bug Tracking**: GitHub Issues, JIRA
- **Test Management**: TestRail, Zephyr

## 🎯 Testing Focus Areas

### Frontend Testing

#### UI Component Testing
- Verify components render correctly
- Test responsive behavior across breakpoints
- Check theme consistency and styling
- Validate interactive elements (buttons, forms)
- Test loading and error states

Example component test:

```tsx
// Example React Testing Library test for an IslandCard component
import { render, screen, fireEvent } from '@testing-library/react';
import { IslandCard } from './IslandCard';

describe('IslandCard', () => {
  const defaultProps = {
    title: 'Ocean Conservation Fund',
    variant: 'beach',
    onAction: jest.fn()
  };

  it('renders the title correctly', () => {
    render(<IslandCard {...defaultProps}>Fund content</IslandCard>);
    expect(screen.getByText('Ocean Conservation Fund')).toBeInTheDocument();
  });

  it('calls onAction when the action button is clicked', () => {
    render(<IslandCard {...defaultProps}>Fund content</IslandCard>);
    fireEvent.click(screen.getByText('Explore'));
    expect(defaultProps.onAction).toHaveBeenCalledTimes(1);
  });

  it('displays content correctly', () => {
    render(<IslandCard {...defaultProps}>Fund content</IslandCard>);
    expect(screen.getByText('Fund content')).toBeInTheDocument();
  });

  it('applies the correct variant styling', () => {
    const { container } = render(
      <IslandCard {...defaultProps} variant="jungle">Fund content</IslandCard>
    );
    expect(container.firstChild).toHaveClass('jungle');
  });
});
```

#### User Flow Testing
- Complete user journeys
- Form submission and validation
- Multi-step processes
- Error handling and recovery
- Session management

Example Cypress test:

```tsx
// Example Cypress test for fund creation flow
describe('Fund Creation Flow', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/funds/create');
  });

  it('allows user to create a new fund', () => {
    // Step 1: Fund Name
    cy.get('[data-testid="fund-name-input"]').type('My Ocean Conservation Fund');
    cy.get('[data-testid="next-button"]').click();

    // Step 2: Fund Description
    cy.get('[data-testid="fund-description-input"]')
      .type('Supporting ocean cleanup initiatives worldwide');
    cy.get('[data-testid="next-button"]').click();

    // Step 3: Initial Funding
    cy.get('[data-testid="funding-amount-input"]').type('1000');
    cy.get('[data-testid="payment-method-select"]').select('credit-card');
    cy.get('[data-testid="next-button"]').click();

    // Step 4: Review and Confirm
    cy.get('[data-testid="review-fund-name"]')
      .should('contain', 'My Ocean Conservation Fund');
    cy.get('[data-testid="review-fund-description"]')
      .should('contain', 'Supporting ocean cleanup initiatives worldwide');
    cy.get('[data-testid="review-funding-amount"]').should('contain', '$1,000.00');
    cy.get('[data-testid="create-fund-button"]').click();

    // Confirmation
    cy.get('[data-testid="success-message"]')
      .should('contain', 'Your fund has been created successfully!');
    cy.get('[data-testid="fund-dashboard-link"]').should('be.visible');
  });

  it('validates form inputs correctly', () => {
    // Empty fund name validation
    cy.get('[data-testid="next-button"]').click();
    cy.get('[data-testid="fund-name-error"]')
      .should('contain', 'Fund name is required');

    // Fund name too short
    cy.get('[data-testid="fund-name-input"]').type('AB');
    cy.get('[data-testid="next-button"]').click();
    cy.get('[data-testid="fund-name-error"]')
      .should('contain', 'Fund name must be at least 3 characters');
  });
});
```

### Backend Testing

#### API Testing
- Endpoint functionality
- Request/response validation
- Authentication and authorization
- Error handling and status codes
- Rate limiting and security measures

Example API test:

```typescript
// Example Supertest test for funds API
import request from 'supertest';
import { app } from '../src/app';
import { createTestUser, generateAuthToken, cleanupTestUser } from './helpers';

describe('Funds API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    userId = await createTestUser();
    authToken = generateAuthToken(userId);
  });

  afterAll(async () => {
    await cleanupTestUser(userId);
  });

  describe('GET /api/v1/funds', () => {
    it('returns user funds when authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/funds')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('returns 401 when not authenticated', async () => {
      const response = await request(app)
        .get('/api/v1/funds');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/funds', () => {
    it('creates a new fund with valid data', async () => {
      const fundData = {
        name: 'Test Fund',
        description: 'Test fund description'
      };

      const response = await request(app)
        .post('/api/v1/funds')
        .set('Authorization', `Bearer ${authToken}`)
        .send(fundData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(fundData.name);
      expect(response.body.data.description).toBe(fundData.description);

      // Cleanup the created fund
      await request(app)
        .delete(`/api/v1/funds/${response.body.data.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('validates required fields', async () => {
      const response = await request(app)
        .post('/api/v1/funds')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

#### Integration Testing
- Database operations
- Service interactions
- External API integrations
- Transaction processing
- Data consistency

### Specialized Testing

#### Accessibility Testing
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- Focus management

Example accessibility test:

```typescript
// Example axe-core accessibility test
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FundCreationForm } from './FundCreationForm';

expect.extend(toHaveNoViolations);

describe('FundCreationForm Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<FundCreationForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

#### Performance Testing
- Page load times
- API response times
- Animation performance
- Resource usage
- Memory leaks

#### Security Testing
- Authentication bypass attempts
- Authorization checks
- Input validation and sanitization
- XSS and CSRF protection
- API rate limiting

## 🌺 Tropical Theme Testing Specifics

### Audio Testing
- Background music playback
- Sound effect triggers
- Mute functionality
- Volume control
- Audio accessibility options

### Animation Testing
- Animation smoothness
- Timing and easing
- Reduced motion preference support
- Performance impact
- Cross-browser compatibility

### Responsive Design Testing
- Mobile breakpoints (320px - 767px)
- Tablet breakpoints (768px - 1023px)
- Desktop breakpoints (1024px+)
- Touch interactions on mobile
- Layout shifts during resizing

### Theme Consistency Testing
- Color palette adherence
- Typography consistency
- Component styling 
- Island/tropical motifs
- Dark/light mode transitions

## 🧠 Testing Best Practices

### General Guidelines
- Test early and test often
- Prioritize critical user journeys
- Use data-testid attributes for test selectors
- Write clear, maintainable test code
- Test both happy paths and edge cases

### Mobile Testing Guidelines
- Test on actual devices when possible
- Verify touch interactions
- Check portrait and landscape orientations
- Test with different network conditions
- Verify font scaling

### Accessibility Testing Guidelines
- Use automated tools (axe, WAVE)
- Test with screen readers
- Verify keyboard navigation
- Check color contrast
- Validate form accessibility

### Performance Testing Guidelines
- Establish performance baselines
- Monitor key metrics (LCP, FID, CLS)
- Test under various network conditions
- Profile CPU and memory usage
- Identify and resolve bottlenecks

## 📊 Test Reporting

### Test Results Format

```markdown
# Test Results: [Feature/Sprint]

## Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Blocked: [Number]
- Test Coverage: [Percentage]

## Critical Issues
1. [Issue description with severity and impact]
2. [Issue description with severity and impact]

## Test Coverage
| Module | Coverage | Status |
|--------|----------|--------|
| Authentication | 95% | ✅ |
| Fund Creation | 87% | ✅ |
| Organization Search | 75% | ⚠️ |
| Donation Processing | 50% | ❌ |

## Recommendation
[Go/No-Go recommendation with rationale]

## Attachments
- [Test evidence links]
- [Test artifacts]
```

### Metrics to Track
- Test pass/fail rates
- Bug severity distribution
- Test coverage percentages
- Time spent on testing phases
- Bug resolution time

## 🔄 Continuous Integration

### CI/CD Integration
- Run unit and integration tests on PRs
- Schedule E2E tests daily
- Run accessibility tests on UI changes
- Generate test coverage reports
- Block merges on test failures

### Automated Testing Pipeline

```yaml
# Example GitHub Actions workflow for testing
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install
      - name: Run unit tests
        run: yarn test:unit

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install
      - name: Run integration tests
        run: yarn test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install
      - name: Run E2E tests
        run: yarn test:e2e

  accessibility-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install
      - name: Run accessibility tests
        run: yarn test:a11y
```

## 🌈 Collaboration Guidelines

### Working with Developers
- Provide clear, reproducible bug reports
- Include visual evidence (screenshots/videos)
- Be specific about environment details
- Focus on the issue, not the solution
- Maintain open communication

### Working with Designers
- Verify designs match implementation
- Test accessibility of design choices
- Provide feedback on usability issues
- Validate responsive behavior
- Test animations and interactions

### Communication Channels
- GitHub Issues for bug tracking
- Pull Request comments for review feedback
- Documentation for test plans and results
- Regular sync meetings for status updates
- Demo sessions for feature validation

---

⏱️ Last Updated: [Current Date]