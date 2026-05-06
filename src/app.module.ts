import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthService } from './health.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [TerminusModule, DatabaseModule, ProductsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService, HealthService],
})
export class AppModule {}
