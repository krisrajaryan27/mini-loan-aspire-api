import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Loan } from './loan.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';
import { uuid } from 'uuidv4';
import { AddRepaymentDto } from './dto/add-repayment.dto';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,
  ) {}

  async createLoan(loanDto: CreateLoanDto): Promise<Loan> {
    if (!loanDto) {
      throw new NotFoundException('Loan data is missing');
    }
    console.log(loanDto);
    const loan = new Loan();
    loan.id = uuid();
    loan.owner = uuid();
    loan.amount = loanDto.amount;
    loan.term = loanDto.term;
    const scheduledRepayments = [];
    const today = new Date();
    for (let week = 1; week <= loan.term; week++) {
      const scheduledRepayment = {
        amount: loanDto.amount / loanDto.term,
        dueDate: new Date(today.getTime() + week * 7 * 24 * 60 * 60 * 1000),
        status: 'PENDING',
      };
      scheduledRepayments.push(scheduledRepayment);
    }

    loan.scheduledRepayments = scheduledRepayments;
    loan.status = 'PENDING';
    return await this.loanRepository.save(loan);
  }

  async approveLoan(id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({ where: { id } });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    // Check if the loan is already approved
    if (loan.status === 'APPROVED') {
      return loan; // Return the loan as it's already approved
    }

    // Update the loan status to 'APPROVED'
    loan.status = 'APPROVED';

    // Save the updated loan entity
    await this.loanRepository.save(loan);

    return loan;
  }

  async viewLoans(userId: string): Promise<Loan[]> {
    const loans = await this.loanRepository.find({
      where: { owner: userId },
    });

    if (!loans || loans.length === 0) {
      throw new NotFoundException('No loans found for the specified user');
    }

    return loans;
  }

  async addRepayment(
    loanId: string,
    repaymentDto: AddRepaymentDto,
  ): Promise<Loan> {
    const loan = await this.loanRepository.findOne({ where: { id: loanId } });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    let allRepaymentsPaid = true; // Assume all repayments are paid initially

    for (const scheduledRepayment of loan.scheduledRepayments) {
      if (
        scheduledRepayment.amount <= repaymentDto.amount &&
        scheduledRepayment.status === 'PENDING'
      ) {
        scheduledRepayment.status = 'PAID';
      }

      if (scheduledRepayment.status === 'PENDING') {
        allRepaymentsPaid = false; // There is at least one pending repayment
      }
    }

    // If all repayments are now marked as 'PAID', update the loan status to 'PAID'
    if (allRepaymentsPaid) {
      loan.status = 'PAID';
    }

    return await this.loanRepository.save(loan);
  }
}
