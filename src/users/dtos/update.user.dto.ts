import { IsEmail } from 'class-validator';

export class UpdateUserDto {

  name?: string;

  @IsEmail()
  email?: string;
}

export class UpdatePassowordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }


  export class ForgotPassowordDto {
    email: string;
    otp: string;
    newPassword: string;
  }