import { IsNumber, IsPositive } from 'class-validator';

export class AddRepaymentDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;
}
