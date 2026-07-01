import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ShopModule } from './shop/shop.module';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payment/payment.module';
import { NotificationModule } from './notification/notification.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { BuyerModule } from './buyer/buyer.module';
import { CartModule } from './cart/cart.module';
import { I18nModule } from './i18n/i18n.module';
import { AdminModule } from './admin/admin.module';
import { DeliveryModule } from './delivery/delivery.module';
import { DriverModule } from './driver/driver.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ShopModule,
    OrderModule,
    ReviewModule,
    PaymentModule,
    NotificationModule,
    ProductModule,
    CategoryModule,
    BuyerModule,
    CartModule,
    I18nModule,
    AdminModule,
    DeliveryModule,
    DriverModule,
    ChatModule,
  ],
})
export class AppModule {}

