import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { MercadopagoModule } from './mercadopago/mercadopago.module';
import { PaymentMercadoPagoModule } from './payment_mercado_pago/payment_mercado_pago.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'prueba_bun',
      entities: [
        UserEntity,
      ],
      synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    }),
    UserModule,
    MercadopagoModule,
    PaymentMercadoPagoModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
