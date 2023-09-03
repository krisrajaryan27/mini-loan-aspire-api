import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ScheduledRepayment {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  loanId: string;

  @Column()
  amount: number;

  @Column()
  dueDate: Date;

  @Column()
  status: string;
}
