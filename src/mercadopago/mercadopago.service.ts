import { Injectable } from '@nestjs/common';
import { CreateMercadopagoDto } from './dto/create-mercadopago.dto';
import { UpdateMercadopagoDto } from './dto/update-mercadopago.dto';

@Injectable()
export class MercadopagoService {
  create(createMercadopagoDto: CreateMercadopagoDto) {
    return 'This action adds a new mercadopago';
  }

  findAll() {
    return `This action returns all mercadopago`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mercadopago`;
  }

  update(id: number, updateMercadopagoDto: UpdateMercadopagoDto) {
    return `This action updates a #${id} mercadopago`;
  }

  remove(id: number) {
    return `This action removes a #${id} mercadopago`;
  }
}
