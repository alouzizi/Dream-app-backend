import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaClient, UserRoles } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "src/constants";
import { CreateUserDto } from "src/dto/create-user.dto";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AuthService {
  jwtService: any;
  constructor(private prisma: PrismaClient) {}

  async register(createUserDto: CreateUserDto, avatar: Express.Multer.File) {
    try {
        const {
            name,
            email,
            phoneNumber,
            googleId,
            password,
            role,
            dob,
            country,
            city,
            gender,
            type,
        } = createUserDto;

        // Check if user already exists by email, phone number, Google ID, or name
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phoneNumber: phoneNumber },
                    { googleId: googleId },
                    { name: name }  // Added name check
                ]
            }
        });

        if (existingUser) {
            // Provide more specific error message
            let errorField = '';
            if (existingUser.email === email) errorField = 'email';
            else if (existingUser.phoneNumber === phoneNumber) errorField = 'phone number';
            else if (existingUser.googleId === googleId) errorField = 'Google ID';
            else if (existingUser.name === name) errorField = 'username';

            throw new ConflictException(`User with this ${errorField} already exists`);
        }

        let hashedPassword = null;
        if (!googleId && password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        let avatarPath = null;
        if (avatar) {
            const uploadDir = './uploads/avatars';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            avatarPath = path.join(uploadDir, `${Date.now()}-${avatar.originalname}`);
            fs.writeFileSync(avatarPath, avatar.buffer);
        }

        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                phoneNumber,
                googleId,
                password: hashedPassword,
                dob: dob ? new Date(dob) : null,
                role: role ?? UserRoles.USER,
                country,
                city,
                avatar: avatarPath,
                gender,
                type,
            },
        });

        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: "1h" });

        return {
            message: "User created successfully",
            user,
            token,
        };
    } catch (error) {
        // Proper error handling
        if (error instanceof ConflictException) {
            throw error;
        }
        if (error.code === 'P2002') {
            const field = error.meta?.target[0];
            throw new ConflictException(`User with this ${field} already exists`);
        }
        throw new InternalServerErrorException('Something went wrong');
    }
}
  

  async login(loginUserDto: any) {
    const { email, password } = loginUserDto;
  
    try {
      // Find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
  
      // Check if the user exists
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (isPasswordValid) {
        const payload = { email: user.email, sub: user.id, role: user.role}; // Include status if needed
        const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: "1h" });
  
        return {
          message: "Login successful",
          user,
          token, // Return the JWT token
        };
      }
  
      // If password is incorrect
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      throw error; // Re-throw any caught exception so it returns the correct status
    }
  }


  async isgoogleAuth(loginUserDto: any) {
    const { googleId } = loginUserDto;
    const user = await this.prisma.user.findUnique({
      where: { googleId },
    });
    if (user) {
      // Generate a JWT token
      const payload = { email: user.email, sub: user.id,role:user.role }; // Customize the payload as per your needs
      const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: "1h" });
      return {
        message: "Login successful",
        user,
        token, // Return the JWT token
      };
    }
    throw new Error("Invalid credentials");
  }

  //update user
  async updateUser(id: string, updateUserDto: any,avatar: Express.Multer.File) {
  try{
	const { name, email, phoneNumber, dob, country, city,gender,type
	} = updateUserDto;

  let avatarPath = null;
      if (avatar) {
        const uploadDir = './uploads/avatars';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        avatarPath = path.join(uploadDir, `${Date.now()}-${avatar.originalname}`);
        fs.writeFileSync(avatarPath, avatar.buffer);
      }

	return this.prisma.user.update({
	  where: { id: Number(id) },
	  data: {
		name,
		email,
		phoneNumber,
		dob: dob ? new Date(dob) : null, // Convert to Date if provided
		country,
		city,
    avatar: avatarPath,
		gender,
    type,
	  },
	});
  }catch(error){
      return error;
  }
  }

 

  //update password
  async updatePassword(id: string, body: any) {
    const { oldPassword, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    //check old password
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid old password");
    }
    return this.prisma.user.update({
      where: { id: Number(id) },
      data: {
        password: hashedPassword,
      },
    });
  }
  

  //delete user
  async deleteUser(id: string,body:any) {
    const { password } = body;
    //check old password
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }


  //admin login
  async adminLogin(loginUserDto: any) {
    const { email, password } = loginUserDto;
  
    try {
      // Find the user by email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
  
      // Check if the user exists
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (isPasswordValid && user.role === UserRoles.ADMIN) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: "1h" });
  
        return {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          token,
        };
      }
  
      // If password is incorrect
      throw new UnauthorizedException('Invalid credentials');
    } catch (error) {
      throw error; // Re-throw any caught exception so it returns the correct status
    }
  }
    
}
