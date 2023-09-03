import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  owner: string;

  @Column()
  amount: number;

  @Column()
  term: number;

  @Column('jsonb', { array: false }) // Use jsonb array for scheduledRepayments
  scheduledRepayments: any[];

  @Column()
  status: string;
}
