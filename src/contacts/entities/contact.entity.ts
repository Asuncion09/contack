import { User } from 'src/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Contact {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ default: false })
  isFavorite: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userEmail', referencedColumnName: 'email' })
  user: User;

  @Column()
  userEmail: string;
}
