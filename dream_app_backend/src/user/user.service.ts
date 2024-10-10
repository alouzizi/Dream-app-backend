import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';  
import { jwtConstants } from 'src/constants';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaClient) {}

	async register(createUserDto: any) {
		const { name, email, phoneNumber, ...rest } = createUserDto;
		// Hash the password if there's one before storing it in the DB (optional step)
		const hashedPassword = await bcrypt.hash(rest.password, 10);
	
		const user = await this.prisma.user.create({
		  data: {
			name,
			email,
			phoneNumber,
			...rest,
			password: hashedPassword
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
	  const isPasswordValid = await bcrypt.compare(password, user.password);
	  if (isPasswordValid) {
		// Generate a JWT token
		const payload = { email: user.email, sub: user.id }; // Customize the payload as per your needs
		const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: '1h' });
		return {
		  message: 'Login successful',
		  user,
		  token,  // Return the JWT token
		};
	}
	  throw new Error('Invalid credentials');
	}

	async isgoogleAuth(loginUserDto: any) {
		const { googleId } = loginUserDto;
		const user = await this.prisma.user.findUnique({
		  where: { googleId },
		});
		if (user) {
		  // Generate a JWT token
		  const payload = { email: user.email, sub: user.id }; // Customize the payload as per your needs
		  const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: '1h' });
		  return {
			message: 'Login successful',
			user,
			token,  // Return the JWT token
		  };
		}
		throw new Error('Invalid credentials');
		
	}
  
	async getUserInfo(id: string) {
	  return this.prisma.user.findUnique({
		where: { id: Number(id) },
	  });
	}
}
