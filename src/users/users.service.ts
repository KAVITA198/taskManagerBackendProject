import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { CreateUserDto } from './dtos/create.user.dto';
import * as bcrypt from 'bcryptjs';
import { ForgotPassowordDto, UpdatePassowordDto, UpdateUserDto } from './dtos/update.user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
      const { email, password, name } = createUserDto;
      const user = await this.prisma.user.create({
        data: {
          email,
          password,
          status: true,
          name,
        },
      });
  
      return user;
    }
  
    async findByEmail(email: string) {
      return this.prisma.user.findUnique({ where: { email } });
    }


  async findAll(user) {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, status: true ,created_at: true},
      orderBy: {created_at : 'desc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id },
      include:{tasks_assigned:true,tasks_created: true,notifications: true}
    });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updatePassword(id: number, data: UpdatePassowordDto) {
    const getOldPassword= await this.prisma.user.findUnique({ where: { id } }); 
    const isMatch = await bcrypt.compare(data.currentPassword, getOldPassword.password);
    if (!isMatch) {
      throw new ConflictException('old password is not correct');
    }
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    if (data.newPassword !== data.confirmPassword) {
      throw new ConflictException('new password and confirm password are not same');
    }else{
      data.newPassword = hashedPassword;
      return this.prisma.user.update({
        where: { id },
        data:{
          password: data.newPassword,
        }
      });
    }
  
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  
}


