import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentMercadoPagoService } from './payment_mercado_pago.service';
import { CreatePaymentMercadoPagoDto } from './dto/create-payment_mercado_pago.dto';
import { UpdatePaymentMercadoPagoDto } from './dto/update-payment_mercado_pago.dto';

@Controller('payment-mercado-pago')
export class PaymentMercadoPagoController {
  constructor(private readonly paymentMercadoPagoService: PaymentMercadoPagoService) {}

  @Post()
  create(@Body() createPaymentMercadoPagoDto: CreatePaymentMercadoPagoDto) {
    return this.paymentMercadoPagoService.create(createPaymentMercadoPagoDto);
  }

  @Get()
  findAll() {
    return this.paymentMercadoPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentMercadoPagoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentMercadoPagoDto: UpdatePaymentMercadoPagoDto) {
    return this.paymentMercadoPagoService.update(+id, updatePaymentMercadoPagoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMercadoPagoService.remove(+id);
  }
}
