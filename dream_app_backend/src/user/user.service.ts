import { Injectable } from "@nestjs/common";
import { PrismaClient, UserRoles } from "@prisma/client";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { jwtConstants } from "src/constants";

@Injectable()
export class UserService {
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
      const payload = { email: user.email, sub: user.id }; // Customize the payload
      const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: "1h" });

      return {
        user,
        token, // Return the JWT token
      };
    } catch (error) {
      return error;
    }
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
      const token = jwt.sign(payload, jwtConstants.secret, { expiresIn: "1h" });
      return {
        message: "Login successful",
        user,
        token, // Return the JWT token
      };
    }
    throw new Error("Invalid credentials");
  }

  async isgoogleAuth(loginUserDto: any) {
    const { googleId } = loginUserDto;
    const user = await this.prisma.user.findUnique({
      where: { googleId },
    });
    if (user) {
      // Generate a JWT token
      const payload = { email: user.email, sub: user.id }; // Customize the payload as per your needs
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
  }

  async getUserInfo(id: string) {
    return this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
  }
}
