import { Module } from '@nestjs/common';
import { PaymentController } from 'src/controllers/payment/payment.controller';
import { PaymentService } from 'src/services/payment/payment.service';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
