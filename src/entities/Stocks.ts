import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class StocksEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  skuCode: string;

  @Column()
  type: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column({ default: null })
  publicId: string | null;

  @Column({ default: null })
  thumbnail: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
