import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMercadoPagoController } from './payment_mercado_pago.controller';
import { PaymentMercadoPagoService } from './payment_mercado_pago.service';

describe('PaymentMercadoPagoController', () => {
  let controller: PaymentMercadoPagoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentMercadoPagoController],
      providers: [PaymentMercadoPagoService],
    }).compile();

    controller = module.get<PaymentMercadoPagoController>(PaymentMercadoPagoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
