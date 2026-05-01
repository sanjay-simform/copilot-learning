# Copilot Instructions

## Project Overview

This is a NestJS backend project focused on clean, modular, and maintainable code architecture. All code generation should follow these overarching principles to ensure consistency and scalability.

---

## Core Principles

### 1. **Modular Architecture**

- **Single Responsibility Principle (SRP)**: Each class should have one reason to change
- **Separation of Concerns**: Controllers handle HTTP, Services handle business logic, DTOs handle validation
- **Feature-based Structure**: Organize code by features/domains (e.g., `/products`) rather than by layer
- Each feature should be self-contained with its own controller, service, module, DTOs, filters, and types

### 2. **Code Organization**

- **Controllers**: HTTP request/response handling, routing, validation decorators
- **Services**: Business logic, data manipulation, error handling
- **DTOs**: Input/output validation using class-validator decorators
- **Types**: TypeScript interfaces for type safety and documentation
- **Filters**: Exception handling and error response formatting
- **Modules**: Feature bundling and dependency injection configuration

### 3. **Type Safety & Code Quality**

- Use strict TypeScript with `strict: true` in tsconfig.json
- Export explicit types/interfaces instead of `any`
- Use discriminated unions for related types
- Leverage TypeScript's type inference where possible
- Keep types close to where they're used

### 4. **Error Handling**

- Use NestJS built-in HTTP exceptions (NotFoundException, ConflictException, etc.)
- Implement custom exception filters for consistent error responses
- Provide clear, actionable error messages
- Include error context (IDs, values) for debugging

### 5. **Code Style**

- Use descriptive, intention-revealing names for functions and variables
- Keep methods focused and under 30 lines when possible
- Add JSDoc comments for public methods and complex logic
- Follow consistent formatting (use eslint configuration)
- Use const by default, let only when reassignment is needed

### 6. **Testing**

- Unit tests for services should mock dependencies
- Integration tests should verify HTTP endpoint behavior
- Use descriptive test names that explain the scenario and expected outcome
- Maintain >80% code coverage for critical paths

---

## Standards by Layer

### Controllers

- Route mapping should be clear and predictable (RESTful conventions)
- Use HTTP decorators appropriately (@Get, @Post, @Patch, @Delete, @HttpCode)
- Delegate all business logic to services
- Use pipes for input validation (ParseUUIDPipe, etc.)
- Apply filters for exception handling
- Methods should be concise (5-10 lines max)

### Services

- Encapsulate all business logic and data operations
- Use dependency injection for other services/repositories
- Throw appropriate NestJS exceptions with clear messages
- Return data types matching DTOs or entities
- Avoid tight coupling with HTTP layer

### DTOs & Types

- DTOs use class-validator decorators for runtime validation
- Types are TypeScript interfaces for compile-time safety
- Keep DTOs lean - only include required fields
- Use composition for common field patterns

### Modules

- Register controllers, providers (services), and imports
- Use feature modules for each domain
- Import shared modules centrally in app.module

---

## When Generating Code

✅ **DO:**

- Follow the existing patterns in products/ module as reference
- Use NestJS decorators properly (@Injectable, @Controller, @UseFilters)
- Write modular, testable code
- Include appropriate error handling
- Add types for all function parameters and return values
- Use dependency injection for service dependencies

❌ **DON'T:**

- Create monolithic files with multiple responsibilities
- Hardcode values that should be configurable
- Ignore error cases
- Use any types (except when absolutely unavoidable)
- Skip input validation
- Mix HTTP concerns with business logic

---

## File Naming Conventions

- Controllers: `*.controller.ts`
- Services: `*.service.ts`
- DTOs: `create-*.dto.ts`, `update-*.dto.ts`
- Types: `*.types.ts`
- Filters: `*-exception.filter.ts` or `*.filter.ts`
- Modules: `*.module.ts`
- Specs: `*.spec.ts`

---

## Example Feature Module Structure

```
src/
  feature-name/
    ├── feature-name.controller.ts
    ├── feature-name.service.ts
    ├── feature-name.module.ts
    ├── dto/
    │   ├── create-feature-name.dto.ts
    │   └── update-feature-name.dto.ts
    ├── types/
    │   └── feature-name.types.ts
    ├── filters/
    │   └── custom-exception.filter.ts
    └── specs/
        ├── feature-name.controller.spec.ts
        └── feature-name.service.spec.ts
```

---

## Helpful Resources

- Follow guidelines in `.github/instructions/controller.instruction.md` for Controller generation
- Follow guidelines in `.github/instructions/service.instruction.md` for Service generation
- Reference the products/ module as the canonical example
