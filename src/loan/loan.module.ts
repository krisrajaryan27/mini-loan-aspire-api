import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './loan.entity';
import { ScheduledRepayment } from './repayment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, ScheduledRepayment])],
  providers: [LoanService],
  controllers: [LoanController],
})
export class LoanModule {}
