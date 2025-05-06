import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { ForgotPassowordDto, UpdatePassowordDto, UpdateUserDto } from './dtos/update.user.dto';

// @ApiBearerAuth('JWT-Auth')
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(@Req() req: Request) {
        const user = req['user'];
      return this.usersService.findAll(user);
    }
  
    @Get('profile')
    findOne(@Req() req: Request) {
      const user = req['user'];
      return this.usersService.findOne(user.id);
    }
  
    @Patch('update/profile')
    update(
      @Req() req: Request,
      @Body() updateUserDto: UpdateUserDto,
    ) {
      const user = req['user'];
      return this.usersService.update(user.id, updateUserDto);
    }

    @Patch('change-password')
    changePassword(
      @Req() req: Request,
      @Body() updatePasswordDto: UpdatePassowordDto,
    ) {
      const user = req['user'];
      return this.usersService.updatePassword(user.id, updatePasswordDto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.usersService.remove(id);
    }


}
