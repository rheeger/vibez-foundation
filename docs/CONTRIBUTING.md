# 🌴 VIBEZ FOUNDATION: Contributing Guidelines 🏝️

Welcome to the VIBEZ FOUNDATION project! We're excited to have you join our tropical-themed community of developers. This document outlines how to contribute to the project and maintain our island vibe while building a high-quality platform.

## 🌊 Code of Conduct

We're all about good vibez here! Please treat all contributors with respect and create a positive environment. Remember:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what's best for the community
- Show empathy towards other community members

## 🏄‍♂️ Getting Started

### Environment Setup

1. Ensure you have Node.js (v18+) and Yarn installed
2. Clone the repository
   ```bash
   git clone https://github.com/your-username/vibez-foundation.git
   cd vibez-foundation
   ```
3. Install dependencies
   ```bash
   yarn install
   ```
4. Start the development server
   ```bash
   yarn nx serve web
   ```

### Project Structure

Familiarize yourself with our [project structure](./technical/tech-stack.md#project-structure) to understand where different components live.

## 🌺 Development Workflow

### Branching Strategy

We follow a trunk-based development approach:

- `main` - Production-ready code
- `feature/[feature-name]` - For new features
- `bugfix/[bug-name]` - For bug fixes
- `hotfix/[hotfix-name]` - For critical production fixes

### Pull Request Process

1. Create a new branch from `main`
2. Implement your changes
3. Write or update tests as needed
4. Update documentation
5. Run linting and tests locally
   ```bash
   yarn nx lint
   yarn nx test
   ```
6. Submit a pull request to `main`
7. Request review from maintainers
8. Address feedback and make necessary changes
9. Once approved, a maintainer will merge your PR

### Commit Message Format

We use conventional commits to maintain a clean git history:

```
type(scope): short description

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or fixing tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(auth): add social login buttons

Implement Google and Facebook login options to improve user onboarding.

Closes #123
```

## 🥥 Coding Standards

### General Guidelines

- Follow the existing code style
- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable and function names
- Follow the DRY (Don't Repeat Yourself) principle

### TypeScript Guidelines

- Enable strict mode
- Use interfaces for object shapes
- Add explicit return types to functions
- Use enums for fixed sets of values
- Avoid `any` type unless absolutely necessary
- Leverage TypeScript's utility types

### React Guidelines

- Use functional components with hooks
- Keep components small and focused
- Utilize the component composition pattern
- Use semantic HTML elements
- Follow accessibility best practices
- Create reusable custom hooks for shared logic

### Styling Guidelines

- Use styled-components for component styling
- Follow the theme's color palette
- Use responsive design principles
- Ensure accessibility (color contrast, focus states)
- Use the existing UI component library when possible

## 🧪 Testing Guidelines

- Write unit tests for all components
- Create integration tests for key workflows
- Ensure good test coverage (aim for 80%+)
- Write readable and maintainable tests
- Mock external dependencies

## 📚 Documentation Guidelines

- Update README.md with new features
- Document all components in Storybook
- Update API documentation for backend changes
- Use JSDoc comments for utility functions
- Keep documentation up-to-date with code changes

## 🌟 Review Process

### Code Review Guidelines

- Be respectful and constructive
- Focus on the code, not the author
- Explain why changes are suggested
- Approve only when all issues are addressed
- Consider the wider context and implications

### What Reviewers Look For

- Code correctness and quality
- Test coverage and quality
- Documentation completeness
- Adherence to project standards
- Performance considerations
- Security implications
- Accessibility compliance

## 🎯 Issue Tracking

- Check existing issues before creating new ones
- Use issue templates when available
- Include steps to reproduce for bugs
- Add screenshots or videos if helpful
- Tag issues appropriately
- Link pull requests to relevant issues

## 🔄 Release Process

- We follow semantic versioning (MAJOR.MINOR.PATCH)
- Release notes are generated from conventional commits
- CI/CD pipeline handles deployment to staging
- Manual approval required for production deployment
- Post-deployment verification is performed

## 🌈 Community

- Join our Slack/Discord channel
- Attend community meetings
- Participate in issue discussions
- Help review pull requests
- Share knowledge and mentor new contributors

---

Thank you for contributing to VIBEZ FOUNDATION! 🎉 Your efforts help make philanthropy more accessible and fun for everyone. Keep the good vibez flowing! 🏝️ 