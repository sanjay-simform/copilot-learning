import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ListPlansQueryDto } from './dto/list-plans-query.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { PlansService } from './plans.service';
import type { ListPlansResponse, PlanDto } from './types/plan.types';

@Controller('plans')
@UseFilters(HttpExceptionFilter)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPlanDto: CreatePlanDto): Promise<PlanDto> {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  findAll(@Query() query: ListPlansQueryDto): Promise<ListPlansResponse> {
    return this.plansService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PlanDto> {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanDto> {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.plansService.remove(id);
  }
}
