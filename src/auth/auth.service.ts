import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { ForgotPassowordDto } from 'src/users/dtos/update.user.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService, // For generating JWT tokens
        private readonly prismaService: PrismaService
      ) {}

      async register(createUserDto: RegisterDto) {
        const { password, email } = createUserDto;
    
        // Check if the user already exists
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
          throw new Error('User already exists');
        }
    
        // Hash the password before saving to the database
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create the user
        const user = await this.usersService.create({
          ...createUserDto,
          password: hashedPassword,
        });
    
        // Generate a JWT token for the user after registration
        const payload = { email: user.email, sub: user.id };
        const token = this.jwtService.sign(payload); 
        return { user, token };
      }
    
      // Validate user credentials during login
      async validateUser(email: string, password: string) {
        // Find user by email
        const user = await this.usersService.findByEmail(email);
        if (!user) {
          throw new ConflictException('Invalid credentials');
        }
    
        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }
        const genereateJwttoken= await this.generateTokens(user.id, user.email);
        await this.prismaService.user.update({
          where:{email: user.email},
          data:{
            refresh_token: genereateJwttoken.access_token
          }
        })

        return {user,token: genereateJwttoken.access_token};
      }

      async generateTokens(id: number, email: string) {
        const [accessToken] = await Promise.all([
          // access token
          this.jwtService.signAsync(
            {
              id,
              email,
            },
            {
              secret: 'at-secret',
              expiresIn: process.env.MASTER_ACCESS_TOKEN_VALIDITY, // process.env.AccessTokenValidity, //expire in 15 min
            },
          ),
        ]);
        const return_data = {
          access_token: accessToken,
        };
        return return_data;
      }

      async validateUserToken(token: string) {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: 'at-secret',
        });
        if (!payload || !payload.id || !payload.email) {
          throw new UnauthorizedException('Invalid token payload');
        }
        const validateUsersData = await this.validateUserData(payload, token);
        return validateUsersData;
      }
    
      async validateUserData(payload, token) {
        try {
          const getUserFromToken = await this.prismaService.user.findUnique({
            where: {
              email: payload.email,
            },
          });
       
          if (!getUserFromToken) {
            throw new ForbiddenException({
              message: `Invalid Token for this user`,
            });
          } else {
            const validateUserData = await this.validateUserTokensDataAndReturnUserInfo(
              payload,
              getUserFromToken,
              token,
            );
            return validateUserData;
          }
        } catch (error) {
          throw error;
        }
      }
    
      async validateUserTokensDataAndReturnUserInfo(payload, getUserInfoData, token) {
        try {
          const getUserData = await this.prismaService.user.findUnique({
            where:{email: payload.email},
          })
          if (!getUserData) {
            throw new UnauthorizedException({ message: `Token Not Found` });
          }
          const isTokenExpired = await this.isTokenExpired(token);
          if (isTokenExpired) {
            return getUserInfoData;
          } else {
            throw new UnauthorizedException({ message: `JWT Token Expired` });
          }
        } catch (error) {
          throw error;
        }
      }
    
      async isTokenExpired(token: string): Promise<boolean> {
        try {
          await jwt.verify(token, 'at-secret');
          return true;
        } catch (error) {
          console.error(error);
          throw new ForbiddenException({
            message: `JWT token Expired`,
          });
        }
      }
      async findByEmail(email: string) {
        return this.prismaService.user.findUnique({ where: { email } });
      }
      async forgotPassword(email: string) {
        try {
          const user = await this.findByEmail(email);
          if (!user) {
            throw new NotFoundException('User not found');
          }
          const opt = Math.floor(100000 + Math.random() * 900000).toString()
          await this.prismaService.user.update({
            where:{id: user.id},
            data:{
              refresh_token:opt
            }
          })
          return {opt};
        } catch (error) {
          throw new ConflictException(error.message)
          
        }
       }
    
       async resetPassword(data: ForgotPassowordDto) {
        try {
          const user = await this.findByEmail(data.email);
          if (!user) {
            throw new NotFoundException('User not found');
          }
          if (user.refresh_token !== data.otp) {
            throw new ConflictException('Invalid OTP');
          }
          const hashedPassword = await bcrypt.hash(data.newPassword, 10);
          const updatedUser = await this.prismaService.user.update({
            where: { id: user.id },
            data: {
              password: hashedPassword,
              refresh_token: null,
            },
          });
          return updatedUser;
        } catch (error) {
          throw new ConflictException(error.message)
          
        }
       }
}

