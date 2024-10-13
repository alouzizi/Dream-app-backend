import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaClient) {}

    async getUserInfo(id: string) {
        return this.prisma.user.findUnique({
            where: { 
                id: Number(id),
                role: 'USER'
            },
        });
    }

    
    //get my info
    async getInfo(id: number) {
        return this.prisma.user.findUnique({
            where: { id: id },
        });
    }



    //get all users
    async getAllUsers() {
        return this.prisma.user.findMany({
            where: {
                role: 'USER', // Filter by role "USER"
            },
        });
    }

    //delete user
    async deleteUser(id: string) {
        return this.prisma.user.delete({
          where: { id: Number(id) },
        });
    }

    //add user diamond
    async addUserDiamond(id: number, diamond: number) {
      if (diamond < 0) {
        throw new HttpException('Diamond value must be non-negative', HttpStatus.BAD_REQUEST);
      }
  
      try {
        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: { diamonds: { increment: diamond } },
        });
  
        if (!updatedUser) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
  
        return updatedUser;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        throw new HttpException('Failed to update user diamonds', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
    //add user coin
    async addUserCoin(id: number, coin: number) {
      if (coin < 0) {
        throw new HttpException('Coin value must be non-negative', HttpStatus.BAD_REQUEST);
      }
  
      try {
        const updatedUser = await this.prisma.user.update({
          where: { id },
          data: { points: { increment: coin },totalPoints: { increment: coin } },
        });
  
        if (!updatedUser) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
  
        return updatedUser;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        throw new HttpException('Failed to update user coins', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }



    //get user filter by name or total diamond or total coin or total point or name
    async getUserFilter(name?: string, diamond?: number, coin?: number, point?: number, type?: string) {
        // Build the filter conditionally based on the presence of parameters
        const filters = [];
      
        if (name) {
          filters.push({ name: { contains: name } });
        }
      
        if (diamond) {
          filters.push({ diamonds: diamond });
        }
      
        if (coin) {
          filters.push({ points: coin });
        }
      
        if (point) {
          filters.push({ totalPoints: point });
        }

        if (type) {
          filters.push({ type: type });
        }
      
        // If no filters are provided, return all users
        return this.prisma.user.findMany({
          where: {
            OR: filters.length ? filters : undefined, // If no filters, don't apply the OR condition
          },
        });
      }
      

    //admin can create user
    async createUser(body: CreateUserDto) {
      try {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
          where: { email: body.email },
        });
  
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
  
        // If user doesn't exist, create new user
        return await this.prisma.user.create({
          data: {
            name: body.name,
            email: body.email,
            password: body.password,
            role: 'USER',
            type: body.type,
            diamonds: 0,
            points: 0,
            totalPoints: 0,
            city: body.city,
            country: body.country,
            phoneNumber: body.phoneNumber,
            dob: body.dob ? new Date(body.dob) : null,
            gender: body.gender,
          },
        });
      } catch (err) {
        if (err instanceof ConflictException) {
          throw err;  // Re-throw ConflictException
        }
        throw new Error('Error while creating user');
      }
    }
  
}
