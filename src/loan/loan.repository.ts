import { Repository } from 'typeorm';
import { Loan } from './loan.entity';

export class LoanRepository extends Repository<Loan> {}
