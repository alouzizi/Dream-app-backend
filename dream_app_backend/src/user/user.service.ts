import { Injectable } from '@nestjs/common';
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
    async addUserDiamond(id: string, diamond: number) {
        return this.prisma.user.update({
          where: { id: Number(id) },
          data: { diamonds: { increment: diamond } },
        });
    }


    //get user filter by name or total diamond or total coin or total point or name
    async getUserFilter(name?: string, diamond?: number, coin?: number, point?: number) {
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
      
        // If no filters are provided, return all users
        return this.prisma.user.findMany({
          where: {
            OR: filters.length ? filters : undefined, // If no filters, don't apply the OR condition
          },
        });
      }
      

    //admin can create user
    async createUser(body: CreateUserDto) {

        return this.prisma.user.create({
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
                dob: body.dob,
                gender: body.gender,
            },
        });
    }
}
