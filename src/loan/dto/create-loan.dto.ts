import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateLoanDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;

  @IsInt({ message: 'Term must be an integer' })
  @IsPositive({ message: 'Term must be a positive integer' })
  @Min(1, { message: 'Term must be at least 1' })
  term: number;
}
