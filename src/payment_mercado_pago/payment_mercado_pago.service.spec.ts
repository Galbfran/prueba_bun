import { Test, TestingModule } from '@nestjs/testing';
import { PaymentMercadoPagoService } from './payment_mercado_pago.service';

describe('PaymentMercadoPagoService', () => {
  let service: PaymentMercadoPagoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentMercadoPagoService],
    }).compile();

    service = module.get<PaymentMercadoPagoService>(PaymentMercadoPagoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
