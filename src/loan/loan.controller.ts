import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Put,
  Param,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { Loan } from './loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';
import { AddRepaymentDto } from './dto/add-repayment.dto';

@Controller('/api/loans')
@Injectable()
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
  ) {}

  @Post()
  async createLoan(@Body() loanDto: CreateLoanDto): Promise<Loan> {
    return await this.loanService.createLoan(loanDto);
  }

  @Put(':loanId/approve')
  async approveLoan(loanId: string): Promise<Loan> {
    return await this.loanService.approveLoan(loanId);
  }

  @Get('/user/:userId')
  async viewLoans(@Param('userId') userId: string): Promise<Loan[]> {
    return await this.loanService.viewLoans(userId);
  }

  @Put(':loanId/repay')
  async addRepayment(
    @Param('loanId') loanId: string,
    @Body() repaymentDto: AddRepaymentDto,
  ): Promise<Loan> {
    return await this.loanService.addRepayment(loanId, repaymentDto);
  }
}
