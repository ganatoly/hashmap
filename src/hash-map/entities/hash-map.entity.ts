import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'hash_map',
})
export class HashMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  hash: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  key: string;

  @Column({ type: 'jsonb', nullable: false })
  value: any;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  expiredAt?: Date;

  isExpired: boolean;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateMainPath(): void {
    this.isExpired =
      this.expiredAt !== null
        ? new Date().valueOf() > this.expiredAt.valueOf()
        : false;
  }

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  constructor(partial: Partial<HashMap>) {
    Object.assign(this, partial);
  }
}
