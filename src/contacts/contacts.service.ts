import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { UserActiveInterface } from '../common/interfaces/user-active.interface';
import { Role } from '../common/enums/rol.enum';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto, user: UserActiveInterface) {
    return await this.contactRepository.save({
      ...createContactDto,
      userEmail: user.email,
    });
  }

  async findAll(user: UserActiveInterface) {
    if (user.role === Role.ADMIN) await this.contactRepository.find();

    return await this.contactRepository.find({
      where: { userEmail: user.email },
    });
  }

  async findOne(id: number, user: UserActiveInterface) {
    const contact = await this.contactRepository.findOneBy({ id });

    if (!contact) {
      throw new BadRequestException('Contact not found');
    }

    this.validateOwnership(contact, user);

    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
    user: UserActiveInterface,
  ) {
    await this.findOne(id, user);
    return await this.contactRepository.update(id, {
      ...updateContactDto,
      userEmail: user.email,
    });
  }

  async remove(id: number, user: UserActiveInterface) {
    await this.findOne(id, user);
    return await this.contactRepository.softDelete({ id });
  }

  private validateOwnership(contact: Contact, user: UserActiveInterface) {
    if (user.role !== Role.ADMIN && contact.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }
}
