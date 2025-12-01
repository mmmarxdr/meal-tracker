import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({
    name: 'verification_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  verificationToken: string | null;

  @Column({
    name: 'verification_token_expiry',
    type: 'timestamp',
    nullable: true,
  })
  verificationTokenExpiry: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
