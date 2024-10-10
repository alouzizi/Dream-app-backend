import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaClient) {}

	async register(createUserDto: any) {
	  const { name, email, phoneNumber, ...rest } = createUserDto;
	  return this.prisma.user.create({
		data: {
		  name,
		  email,
		  phoneNumber,
		  ...rest,
		},
	  });
	}
  
	async login(loginUserDto: any) {
	  const { email, password } = loginUserDto;
	  const user = await this.prisma.user.findUnique({
		where: { email },
	  });
  
	  // Add password validation logic here (hashing, etc.)
	  if (user && user.password === password) {
		return { message: 'Login successful', user };
	  }
  
	  throw new Error('Invalid credentials');
	}
  
	async getUserInfo(id: string) {
	  return this.prisma.user.findUnique({
		where: { id: Number(id) },
	  });
	}
}
