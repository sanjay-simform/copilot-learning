# Copilot Learning - NestJS Backend API

A production-ready NestJS backend project demonstrating clean, modular architecture with strict type safety, comprehensive error handling, and maintainable code patterns. Built with a focus on scalability, testability, and developer experience.

## 🎯 Project Overview

This project serves as a reference implementation for building NestJS applications following SOLID principles and clean architecture patterns. It includes a fully functional Products API with:

- Feature-based modular structure
- Input validation using DTOs with `class-validator`
- Custom exception handling with global filters
- Type-safe implementations with TypeScript strict mode
- RESTful API conventions
- Comprehensive test coverage
- Production-ready error responses

## ⚡ Quick Start

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (with auto-reload)
pnpm start:dev

# Server will run on http://localhost:3000
```

### Verify Setup

Test the API health check:

```bash
curl http://localhost:3000
```

Expected response:

```json
{
  "message": "Copilot Learning API is running!"
}
```

## 📁 Project Structure

```
src/
├── app.controller.ts          # Root HTTP route handler
├── app.module.ts              # Root module with feature imports
├── app.service.ts             # Root service
├── main.ts                    # Application entry point & bootstrap
└── products/                  # Feature module (canonical example)
    ├── products.controller.ts # HTTP handlers for /products endpoints
    ├── products.service.ts    # Business logic & data operations
    ├── products.module.ts     # Feature module configuration
    ├── dto/                   # Input/output validation schemas
    │   ├── create-product.dto.ts
    │   └── update-product.dto.ts
    ├── filters/               # Custom exception handlers
    │   └── http-exception.filter.ts
    └── types/                 # TypeScript interfaces
        └── product.types.ts
```

### Architecture Principles

**Separation of Concerns**:

- **Controllers** handle HTTP requests/responses and routing
- **Services** encapsulate business logic and data operations
- **DTOs** validate input and shape output
- **Types** provide compile-time type safety
- **Filters** handle errors consistently

**Feature-Based Organization**:
Each feature (e.g., `products/`) is self-contained with its own controller, service, module, DTOs, filters, and types. This makes features easy to test, scale, and maintain independently.

## 🚀 API Reference

### Products Endpoints

#### Create Product

```http
POST /products
Content-Type: application/json

{
  "name": "Laptop",
  "sku": "LAPTOP-001",
  "price": 999.99,
  "description": "High-performance laptop"
}
```

**Response** (201 Created):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Laptop",
  "sku": "LAPTOP-001",
  "price": 999.99,
  "description": "High-performance laptop",
  "createdAt": "2026-05-01T10:30:00Z"
}
```

**Error Responses**:

- `400 Bad Request` - Invalid input (missing/invalid fields)
- `409 Conflict` - SKU already exists

#### Get All Products

```http
GET /products
```

**Response** (200 OK):

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Laptop",
    "sku": "LAPTOP-001",
    "price": 999.99,
    "description": "High-performance laptop",
    "createdAt": "2026-05-01T10:30:00Z"
  }
]
```

#### Get Product by ID

```http
GET /products/:id
```

**Response** (200 OK):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Laptop",
  "sku": "LAPTOP-001",
  "price": 999.99,
  "description": "High-performance laptop",
  "createdAt": "2026-05-01T10:30:00Z"
}
```

**Error Responses**:

- `400 Bad Request` - Invalid UUID format
- `404 Not Found` - Product not found

#### Update Product

```http
PATCH /products/:id
Content-Type: application/json

{
  "name": "Gaming Laptop",
  "price": 1299.99
}
```

**Response** (200 OK): Updated product object

**Error Responses**:

- `400 Bad Request` - Invalid input or UUID format
- `404 Not Found` - Product not found
- `409 Conflict` - SKU conflict with another product

#### Delete Product

```http
DELETE /products/:id
```

**Response** (204 No Content)

**Error Responses**:

- `400 Bad Request` - Invalid UUID format
- `404 Not Found` - Product not found

## 🛠️ Development

### Running the Application

```bash
# Development server (with hot-reload)
pnpm start:dev

# Debug mode (Node debugger on port 9229)
pnpm start:debug

# Production build and start
pnpm build
pnpm start:prod
```

### Code Quality

```bash
# Format code with Prettier
pnpm format

# Lint and auto-fix issues
pnpm lint

# Run tests
pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm test:watch

# Generate coverage report
pnpm test:cov

# Debug tests
pnpm test:debug
```

## 🧪 Testing

The project includes unit tests for services and integration tests for API endpoints.

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode for development
pnpm test:watch

# Generate coverage report (target: >80% for critical paths)
pnpm test:cov

# Run E2E tests
pnpm test:e2e
```

### Test Structure

- **Unit Tests** (`*.spec.ts`): Test services with mocked dependencies
- **Integration Tests** (`test/`): Verify HTTP endpoint behavior
- **Test Examples**: See `src/app.controller.spec.ts` and `test/app.e2e-spec.ts`

## 🏗️ Code Conventions

### Naming Conventions

- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **DTOs**: `create-*.dto.ts`, `update-*.dto.ts`
- **Types**: `*.types.ts`
- **Filters**: `*-exception.filter.ts`
- **Modules**: `*.module.ts`
- **Tests**: `*.spec.ts`

### TypeScript Standards

- Strict mode enabled (`strict: true` in `tsconfig.json`)
- Explicit types for all function parameters and return values
- No `any` types except when absolutely unavoidable
- Use discriminated unions for related types
- Keep types close to where they're used

### Code Style

- Use `const` by default, `let` only when reassignment is needed
- Keep methods under 30 lines when possible
- Add JSDoc comments for public methods and complex logic
- Use descriptive, intention-revealing names
- Follow ESLint configuration

### Error Handling

- Use NestJS built-in HTTP exceptions (`NotFoundException`, `ConflictException`, etc.)
- Provide clear, actionable error messages
- Include error context (IDs, values) for debugging
- Use custom exception filters for consistent response formatting

## 🔧 Configuration

### Environment Variables

Currently, the application uses default configuration:

- **PORT**: `3000` (default, can override with `PORT` env variable)

Example:

```bash
PORT=8080 pnpm start
```

### Global Pipes

The application includes global validation with:

- `whitelist: true` - Strip unknown properties
- `forbidNonWhitelisted: true` - Throw error on unknown properties
- `transform: true` - Transform plain objects to DTO instances
- `transformOptions.enableImplicitConversion: true` - Type coercion for primitives

## 📚 Key Features

### ✅ Input Validation

All endpoints validate input using class-validator decorators. Invalid requests return `400 Bad Request` with detailed error messages.

### ✅ Exception Handling

Custom `HttpExceptionFilter` provides consistent error response formatting across all endpoints.

### ✅ Type Safety

Full TypeScript strict mode with explicit types prevents runtime errors and improves IDE experience.

### ✅ RESTful Design

API follows REST conventions:

- `POST /products` - Create
- `GET /products` - List
- `GET /products/:id` - Retrieve
- `PATCH /products/:id` - Update
- `DELETE /products/:id` - Delete

### ✅ Modular Architecture

Feature-based structure makes it easy to:

- Add new features independently
- Test modules in isolation
- Scale the application
- Maintain clear separation of concerns

## 🚨 Common Issues & Troubleshooting

### Port Already in Use

```bash
# Use a different port
PORT=3001 pnpm start:dev

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Validation Errors on Valid Input

Check that:

1. JSON is properly formatted (no trailing commas)
2. Required fields are present (see DTO definitions)
3. Field types match expectations (strings, numbers, etc.)
4. Content-Type header is set to `application/json`

### Tests Failing After Changes

```bash
# Clear Jest cache and re-run
pnpm jest --clearCache
pnpm test
```

### TypeScript Compilation Errors

```bash
# Check tsconfig.json for strict mode settings
# Ensure all function parameters and returns have explicit types
# Run ESLint to catch type issues
pnpm lint
```

## 📖 Additional Resources

- [NestJS Official Documentation](https://docs.nestjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Class Validator Documentation](https://github.com/typestack/class-validator)
- [Project Code Standards](./.github/copilot-instructions.md) - Architecture principles and conventions

## 🤝 Contributing

When adding new features or modules, follow these guidelines:

1. **Create a Feature Module**: Follow the `products/` structure
2. **Write Tests First**: Unit tests for services, integration tests for endpoints
3. **Validate Input**: Use DTOs with class-validator
4. **Handle Errors**: Use appropriate NestJS exceptions
5. **Maintain Types**: Keep TypeScript strict mode compliant
6. **Document Code**: Add JSDoc for public methods
7. **Format Code**: Run `pnpm format && pnpm lint` before committing

## 📝 License

UNLICENSED - Internal use only

---

**Last Updated**: May 1, 2026  
**Version**: 0.0.1
