import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaClient, UserRoles } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "src/constants";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(createUserDto: any) {
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
      } = createUserDto;
  
      // Check if user already exists by email, phone number, or Google ID
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { phoneNumber: phoneNumber },
            { googleId: googleId }
          ]
        }
      });
  
      if (existingUser) {
        return {
          message: "User already exists",
          statusCode: 400,
        };
      }
  
      let hashedPassword = null;
  
      // If googleId is not provided, hash the password
      if (!googleId && password) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
  
      // Create user with or without the password (depending on googleId)
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          phoneNumber,
          googleId,
          password: hashedPassword,  // Will be null if not provided
          dob: dob ? new Date(dob) : null, // Convert to Date if provided
          role: role ?? UserRoles.USER,
          country: country,
          city: city,
          gender: gender,
          type: "normal", // Default type // normal and special
        },
      });
  
      // Generate a JWT token
      const payload = { email: user.email, sub: user.id, role: user.role }; // Customize the payload
      const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: "1h" });
  
      return {
        message: "User created successfully",
        user,
        token, // Return the JWT token
      };
    } catch (error) {
      return error;
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
  async updateUser(id: string, updateUserDto: any) {
  try{
	const { name, email, phoneNumber, dob, country, city,gender
	} = updateUserDto;
	return this.prisma.user.update({
	  where: { id: Number(id) },
	  data: {
		name,
		email,
		phoneNumber,
		dob: dob ? new Date(dob) : null, // Convert to Date if provided
		country,
		city,
		gender,
	  },
	});
  }catch(error){
      return error;
  }
  }

  async getUserInfo(id: string) {
    return this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
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

  //get all users
  async getAllUsers() {
    return this.prisma.user.findMany();
  }
    
}
