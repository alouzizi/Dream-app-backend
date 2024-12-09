import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from "src/dto/create-user.dto";
import { UserRoles } from "src/role.guard";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaClient) {}

  async getUserInfo(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
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
        select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
            gender: true,
            points: true,
            totalPoints: true,
            type: true,
            diamonds: true,
            avatar: true,
            createAt: true
        },
        orderBy: {
            createAt: "desc"
        },
        where: {
            role: "USER"
        }
    });
  }

  //delete user
  async deleteUser(id: string) {
    //handel if user not found
    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.role == UserRoles.ADMIN) {
      throw new NotAcceptableException("You can't remove this user");
    }

    return this.prisma.user.delete({
      where: { id: Number(id) },
    });
  }

  //add user diamond
  async addUserDiamond(id: number, diamond: number) {
    if (diamond < 0) {
      throw new HttpException(
        "Diamond value must be non-negative",
        HttpStatus.BAD_REQUEST
      );
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
      if (error.code === "P2025") {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new HttpException(
        "Failed to update user diamonds",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  //add user coin
  async addUserCoin(id: number, coin: number) {
    if (coin < 0) {
      throw new HttpException(
        "Coin value must be non-negative",
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { points: { increment: coin }, totalPoints: { increment: coin } },
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === "P2025") {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new HttpException(
        "Failed to update user coins",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //get user filter by name or total diamond or total coin or total point or name
  async getUserFilter(
    name?: string,
    diamond?: number,
    coin?: number,
    point?: number,
    type?: string,
    page: number = 1,
    limit: number = 10
  ) {
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

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          OR: filters.length ? filters : undefined,
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({
        where: {
          OR: filters.length ? filters : undefined,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  //admin can create user
  async createUser(userData: CreateUserDto ) {
    try {
        // Check if user already exists using OR condition
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: userData.email },
                    { phoneNumber: userData.phoneNumber },
                    { name: userData.name }
                ]
            }
        });

        if (existingUser) {
            // More specific error message
            if (existingUser.email === userData.email) {
                throw new ConflictException("User with this email already exists");
            }
            if (existingUser.phoneNumber === userData.phoneNumber) {
                throw new ConflictException("User with this phone number already exists");
            }
            if (existingUser.name === userData.name) {
                throw new ConflictException("User with this name already exists");
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create new user
        return await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: UserRoles.USER,
                type: userData.type,
                points: userData.initialCoins,
                totalPoints: userData.initialCoins,
                diamonds: userData.initialDiamonds,
                city: userData.city,
                country: userData.country,
                phoneNumber: userData.phoneNumber,
                dob: userData.dob ? new Date(userData.dob) : null,
                gender: userData.gender,
                avatar: userData.avatar,
            },
        });
    } catch (err) {
        if (err instanceof ConflictException) {
            throw err;
        }
        console.error("Error creating user:", err);
        throw new InternalServerErrorException("Error while creating user");
    }
}

  async updateUserPoints(userId: number, newPoints: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { points: newPoints },
    });
  }

  async updateUserDiamonds(userId: number, newDiamonds: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { diamonds: newDiamonds },
    });
  }
}
