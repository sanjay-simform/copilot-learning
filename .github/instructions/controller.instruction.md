---
name: controller.instruction
description: 'Use when: generating NestJS controllers for HTTP request handling, routing, input validation, and delegation to services. Follow this for clean, modular controllers.'
applyTo: 'src/**/*.controller.ts'
---

# NestJS Controller Instructions

## Purpose

Controllers in NestJS handle HTTP requests/responses and route them to services. Controllers should be thin - delegating all business logic to services while maintaining clean, readable routing.

---

## Key Principles

### 1. **Single Responsibility**

- Controllers should ONLY handle HTTP concerns:
  - Route mapping and HTTP method decoration
  - Request/response serialization
  - Input validation through pipes
  - Exception handling via filters
- **Move ALL business logic to the Service layer**

### 2. **Clear Route Design**

- Use RESTful conventions:
  - `POST /resource` - Create
  - `GET /resource` - List all
  - `GET /resource/:id` - Get one
  - `PATCH /resource/:id` - Update
  - `DELETE /resource/:id` - Delete
- Routes should be intuitive and predictable
- Use meaningful parameter names

### 3. **Type Safety & Validation**

- Always define return types (explicit, not `void`)
- Use pipes for input validation: `ParseUUIDPipe`, `ParseIntPipe`, etc.
- Accept DTOs in @Body with proper decorators
- Use @Param, @Query, @Body decorators appropriately

### 4. **Conciseness**

- Methods should be 5-10 lines maximum
- One method = one HTTP endpoint
- Delegate everything to injected services
- No hardcoded business logic

### 5. **Proper HTTP Status Codes**

- Use @HttpCode decorator for non-200 responses
- POST creating resources: 201 CREATED
- DELETE operations: 204 NO_CONTENT
- Errors: Let service/filter handle (NotFoundException, ConflictException, etc.)

### 6. **Filters & Exception Handling**

- Use @UseFilters() at class or method level
- Apply filters consistently across related endpoints
- Filters handle exceptions and format error responses
- Controllers don't catch exceptions; let filters handle them

---

## Structure Template

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseFilters,
} from '@nestjs/common';
import { YourService } from './your-feature.service';
import { CreateYourDto } from './dto/create-your-feature.dto';
import { UpdateYourDto } from './dto/update-your-feature.dto';
import { YourExceptionFilter } from './filters/your-exception.filter';
import type { YourEntity } from './types/your-feature.types';

@Controller('your-resource')
@UseFilters(YourExceptionFilter)
export class YourController {
  constructor(private readonly yourService: YourService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateYourDto): YourEntity {
    return this.yourService.create(createDto);
  }

  @Get()
  findAll(): YourEntity[] {
    return this.yourService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): YourEntity {
    return this.yourService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateYourDto,
  ): YourEntity {
    return this.yourService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.yourService.remove(id);
  }
}
```

---

## Checklist for Generated Controllers

### Code Quality

- [ ] Each method corresponds to exactly one HTTP route
- [ ] Methods are under 10 lines
- [ ] All return types are explicitly defined (no `any`)
- [ ] No business logic in controller methods
- [ ] Input validation uses appropriate pipes

### NestJS Patterns

- [ ] Uses dependency injection via constructor
- [ ] All services are marked `readonly` in constructor
- [ ] Decorators are imported from `@nestjs/common`
- [ ] Routes follow RESTful conventions
- [ ] HTTP status codes are appropriate (@HttpCode decorators)

### Type Safety

- [ ] Parameters use ParseUUIDPipe or other validation pipes
- [ ] DTOs are imported and used for request bodies
- [ ] Return types reference Types or Entities
- [ ] No implicit `any` types

### Organization

- [ ] Imports are organized: NestJS first, then local modules, then DTOs, then Types
- [ ] Related endpoints are grouped logically
- [ ] Exception handling is delegated to filters
- [ ] Comments explain non-obvious routing decisions

---

## Good Examples (Reference)

### ✅ Good Controller

```typescript
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string): User {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateUserDto,
  ): User {
    return this.usersService.update(id, updateDto);
  }
}
```

### ❌ Poor Controller (Avoid)

```typescript
export class UsersController {
  // DON'T: Business logic in controller
  @Post()
  create(@Body() data: any): any {
    const user = { id: Math.random(), ...data };
    validateEmail(user.email); // Business logic!
    saveToDatabase(user); // Data access!
    return user;
  }

  // DON'T: No type safety
  @Get(':id')
  getById(id): any {
    return findInMemory(id);
  }
}
```

---

## Common Patterns

### Handling Optional Query Parameters

```typescript
@Get()
findAll(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
): YourEntity[] {
  return this.yourService.findAll({ page, limit });
}
```

### Multiple Path Parameters

```typescript
@Get(':parentId/children/:childId')
getChild(
  @Param('parentId', ParseUUIDPipe) parentId: string,
  @Param('childId', ParseUUIDPipe) childId: string,
): ChildEntity {
  return this.yourService.getChild(parentId, childId);
}
```

### Proper HTTP Status for Deletion

```typescript
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
remove(@Param('id', ParseUUIDPipe) id: string): void {
  this.yourService.remove(id);
  // NO return statement - 204 NO_CONTENT
}
```

---

## When NOT to Generate Here

- If you need business logic validation → Use Service
- If you need data transformation → Use DTO
- If you need error formatting → Use Exception Filter
- If you need shared types → Create separate types file
