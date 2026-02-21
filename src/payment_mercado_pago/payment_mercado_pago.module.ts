import { Module } from '@nestjs/common';
import { PaymentMercadoPagoService } from './payment_mercado_pago.service';
import { PaymentMercadoPagoController } from './payment_mercado_pago.controller';

@Module({
  controllers: [PaymentMercadoPagoController],
  providers: [PaymentMercadoPagoService],
})
export class PaymentMercadoPagoModule {}
