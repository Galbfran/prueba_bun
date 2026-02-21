import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentMercadoPagoDto } from './create-payment_mercado_pago.dto';

export class UpdatePaymentMercadoPagoDto extends PartialType(CreatePaymentMercadoPagoDto) {}
