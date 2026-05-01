---
name: service.instruction
description: 'Use when: generating NestJS services for business logic, data operations, validation, and error handling. Follow this for clean, reusable, well-tested services.'
applyTo: 'src/**/*.service.ts'
---

# NestJS Service Instructions

## Purpose

Services in NestJS contain all business logic, data operations, and validation. Services are independent of HTTP concerns and should be highly reusable and testable.

---

## Key Principles

### 1. **Encapsulate All Business Logic**

- Services handle:
  - Data validation and transformation
  - Business rules enforcement
  - Data persistence operations
  - Complex calculations
  - Interaction with repositories/data sources
- Controllers and other services call service methods
- Services are HTTP-agnostic

### 2. **Single Responsibility**

- One service = One domain entity or closely related group
- Service method = One clear operation
- If a service has too many methods (>10), consider splitting it
- Examples:
  - `UserService` - User CRUD and user-specific logic
  - `AuthService` - Authentication and authorization
  - `ProductService` - Product CRUD and product logic

### 3. **Dependency Injection**

- Use constructor injection for dependencies
- Mark all injected dependencies as `readonly`
- Inject repositories, other services, or utilities
- Avoid hard-coding external dependencies
- Makes services testable and loosely coupled

### 4. **Error Handling**

- Throw NestJS HTTP exceptions with meaningful messages:
  - `NotFoundException` - Resource doesn't exist
  - `ConflictException` - Constraint violation (duplicate, conflict)
  - `BadRequestException` - Invalid input
  - `UnauthorizedException` - Auth failure
  - `ForbiddenException` - Permission denied
- Include context in error messages (IDs, values, reason)
- Let exceptions propagate; don't catch unless handling specifically

### 5. **Type Safety**

- Always define parameter and return types
- Use DTOs for input validation (accept DTO, don't use `any`)
- Return strongly-typed entities/objects
- Use TypeScript interfaces for all complex objects
- Avoid `any` types

### 6. **Testability**

- Keep methods under 30 lines
- Avoid nested service calls without clear purpose
- Methods should have clear inputs/outputs
- Make dependencies injectable for mocking in tests
- Business logic should be pure where possible

---

## Structure Template

```typescript
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateYourDto } from './dto/create-your-feature.dto';
import { UpdateYourDto } from './dto/update-your-feature.dto';
import type { YourEntity } from './types/your-feature.types';

@Injectable()
export class YourService {
  constructor(
    private readonly yourRepository: YourRepository,
    private readonly otherService: OtherService,
  ) {}

  /**
   * Creates a new entity with validation.
   * @param dto - Create data
   * @returns Created entity
   * @throws ConflictException if entity with same unique constraint exists
   */
  create(dto: CreateYourDto): YourEntity {
    this.validateCreate(dto);

    const existing = this.yourRepository.findByUniqueField(dto.uniqueField);
    if (existing) {
      throw new ConflictException(
        `Entity with field '${dto.uniqueField}' already exists`,
      );
    }

    return this.yourRepository.save({
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Retrieves all entities.
   * @returns Array of entities
   */
  findAll(): YourEntity[] {
    return this.yourRepository.findAll();
  }

  /**
   * Retrieves a single entity by ID.
   * @param id - Entity ID
   * @returns Entity
   * @throws NotFoundException if entity doesn't exist
   */
  findOne(id: string): YourEntity {
    const entity = this.yourRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with id '${id}' not found`);
    }
    return entity;
  }

  /**
   * Updates an existing entity.
   * @param id - Entity ID
   * @param dto - Update data
   * @returns Updated entity
   * @throws NotFoundException if entity doesn't exist
   * @throws ConflictException if update violates constraints
   */
  update(id: string, dto: UpdateYourDto): YourEntity {
    const entity = this.findOne(id); // Validates existence
    this.validateUpdate(dto);

    const updated = this.yourRepository.update(id, {
      ...entity,
      ...dto,
      updatedAt: new Date(),
    });

    return updated;
  }

  /**
   * Removes an entity by ID.
   * @param id - Entity ID
   * @throws NotFoundException if entity doesn't exist
   */
  remove(id: string): void {
    this.findOne(id); // Validates existence
    this.yourRepository.delete(id);
  }

  // Private helper methods for validation/business logic
  private validateCreate(dto: CreateYourDto): void {
    if (!dto.name?.trim()) {
      throw new BadRequestException('Name is required and cannot be empty');
    }
    // Additional validation...
  }

  private validateUpdate(dto: UpdateYourDto): void {
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new BadRequestException('Name cannot be empty');
    }
    // Additional validation...
  }
}
```

---

## Checklist for Generated Services

### Code Quality

- [ ] All methods have clear, single purposes
- [ ] Business logic is encapsulated (not exposed to controllers)
- [ ] Methods are under 30 lines
- [ ] No hardcoded values; configuration is injectable or passed as params
- [ ] Private helper methods exist for complex validation logic

### Dependency Injection

- [ ] Constructor uses private readonly for all dependencies
- [ ] @Injectable() decorator is present
- [ ] No `new` keyword for dependencies (use DI)
- [ ] External services/repositories are injected

### Error Handling

- [ ] Uses appropriate NestJS exceptions
- [ ] Error messages include context (IDs, values)
- [ ] Exceptions are thrown, not caught (unless specific handling needed)
- [ ] Resource existence is validated before operations

### Type Safety

- [ ] All parameters have explicit types (no `any`)
- [ ] All return types are explicit (no implicit `any`)
- [ ] DTOs are used for input validation
- [ ] Return types match domain entities/types
- [ ] No implicit undefined returns

### Documentation

- [ ] Public methods have JSDoc comments
- [ ] @param and @returns documented
- [ ] @throws documented for exceptions
- [ ] Complex business logic has inline comments

### Testability

- [ ] Methods have obvious inputs and outputs
- [ ] Dependencies are injectable
- [ ] Methods don't have side effects (except data persistence)
- [ ] Validation logic is separated from persistence

---

## Good Examples (Reference)

### ✅ Good Service

```typescript
@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly priceService: PriceService,
  ) {}

  /**
   * Creates a new product with validation.
   * @param dto - Product creation data
   * @returns Created product
   * @throws ConflictException if SKU already exists
   */
  create(dto: CreateProductDto): Product {
    // Validate SKU uniqueness
    const existing = this.productRepository.findBySku(dto.sku);
    if (existing) {
      throw new ConflictException(`SKU '${dto.sku}' is already in use`);
    }

    // Create with defaults
    const product = {
      id: randomUUID(),
      ...dto,
      status: dto.status ?? 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.productRepository.save(product);
  }

  /**
   * Updates product pricing.
   * @param id - Product ID
   * @param newPrice - New price
   * @throws NotFoundException if product doesn't exist
   * @throws BadRequestException if price is invalid
   */
  updatePrice(id: string, newPrice: number): Product {
    const product = this.findOne(id);

    if (newPrice <= 0) {
      throw new BadRequestException('Price must be greater than 0');
    }

    return this.productRepository.update(id, {
      ...product,
      price: newPrice,
      updatedAt: new Date(),
    });
  }

  private findOne(id: string): Product {
    const product = this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
    return product;
  }
}
```

### ❌ Poor Service (Avoid)

```typescript
export class ProductService {
  // DON'T: No DI, hardcoded dependency
  private db = new Database();

  // DON'T: HTTP knowledge in service
  create(req: Request): Response {
    const product = req.body;
    return res.status(201).json(product);
  }

  // DON'T: No error handling
  getProduct(id): any {
    return this.db.query(`SELECT * FROM products WHERE id = ${id}`);
  }

  // DON'T: Too many responsibilities
  createAndSendEmail(dto): void {
    this.db.insert(dto);
    nodemailer.send(); // Wrong layer!
  }

  // DON'T: No type safety
  process(data) {
    return data.map((x) => ({ ...x, processed: true }));
  }
}
```

---

## Common Patterns

### Validation with Clear Error Messages

```typescript
private validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new BadRequestException(`Invalid email format: '${email}'`);
  }
}
```

### Checking for Resource Existence

```typescript
private ensureExists(id: string): Entity {
  const entity = this.repository.findById(id);
  if (!entity) {
    throw new NotFoundException(
      `Entity with id '${id}' not found in database`
    );
  }
  return entity;
}
```

### Atomic Updates with Validation

```typescript
update(id: string, dto: UpdateDto): Entity {
  const existing = this.ensureExists(id);
  this.validateUpdate(dto);

  return this.repository.update(id, {
    ...existing,
    ...dto,
    updatedAt: new Date(),
  });
}
```

### Service-to-Service Communication

```typescript
// Good: Services call other services for delegation
async processOrder(orderId: string): Promise<Order> {
  const order = this.orderRepository.findById(orderId);

  // Use other service for its domain responsibility
  const payment = await this.paymentService.process(order.amount);

  if (!payment.success) {
    throw new ConflictException('Payment processing failed');
  }

  return this.orderRepository.update(orderId, {
    status: 'completed'
  });
}
```

---

## When NOT to Generate Here

- If it's HTTP-related → Use Controller
- If it's validation rules for input → Use DTO
- If it's error response formatting → Use Exception Filter
- If it's database schema → Use Entity/Type definition
