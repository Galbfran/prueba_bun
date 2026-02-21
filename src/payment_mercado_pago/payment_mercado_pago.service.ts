import { Injectable } from '@nestjs/common';
import { CreatePaymentMercadoPagoDto } from './dto/create-payment_mercado_pago.dto';
import { UpdatePaymentMercadoPagoDto } from './dto/update-payment_mercado_pago.dto';

@Injectable()
export class PaymentMercadoPagoService {
  create(createPaymentMercadoPagoDto: CreatePaymentMercadoPagoDto) {
    return 'This action adds a new paymentMercadoPago';
  }

  findAll() {
    return `This action returns all paymentMercadoPago`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMercadoPago`;
  }

  update(id: number, updatePaymentMercadoPagoDto: UpdatePaymentMercadoPagoDto) {
    return `This action updates a #${id} paymentMercadoPago`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMercadoPago`;
  }
}
