import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { jwtConstants } from 'src/constants';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaClient) {}

	async register(createUserDto: any) {
		const { name, email, phoneNumber, ...rest } = createUserDto;
	
		// Hash the password if there's one before storing it in the DB (optional step)
		// const hashedPassword = await crypto.hash(rest.password, 10);
	
		const user = await this.prisma.user.create({
		  data: {
			name,
			email,
			phoneNumber,
			...rest,
			// password: hashedPassword // Save the hashed password if necessary
		  },
		});
	
		// Generate a JWT token
		const payload = { email: user.email, sub: user.id }; // Customize the payload as per your needs
		const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: '1h' });
	
		return {
		  user,
		  token,  // Return the JWT token
		};
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

	async isgoogleAuth(loginUserDto: any) {
		const { googleId } = loginUserDto;
		const user = await this.prisma.user.findUnique({
		  where: { googleId },
		});
		if (user) {
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
