import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [DatabaseModule, ProductsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
