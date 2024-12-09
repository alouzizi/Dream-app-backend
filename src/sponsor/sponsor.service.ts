import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { SponsorStatus } from "@prisma/client";

@Injectable()
export class SponsorService {
  constructor(private prisma: PrismaClient) {}

  // Fetch all sponsors
  async findAll() {
    // Use Prisma's include to fetch games count in a single query
    const sponsors = await this.prisma.sponsor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            games: true,
          },
        },
      },
    });
  
    // Transform the response to match your desired format
    return sponsors.map((sponsor) => ({
      ...sponsor,
      games: sponsor._count.games,
      _count: undefined, // Remove the _count property from the final response
    }));
  }

  // Fetch a single sponsor by ID
  async findOne(id: number) {
    return this.prisma.sponsor.findUnique({ where: { id } });
  }

  // Create a new sponsor
  async create(data: { name: string; logo?: string; status: SponsorStatus }) {
    const status = data.status ?? SponsorStatus.INACTIVE;
    return this.prisma.sponsor.create({ data: { ...data, status } });
  }

  // Update a sponsor by ID
  async update(
    id: number,
    data: { name?: string; logo?: string; status?: SponsorStatus }
  ) {
    console.log("data", data);
    return this.prisma.sponsor.update({
      where: { id },
      data,
    });
  }

  // Delete a sponsor by ID
  async delete(id: number) {
    return this.prisma.sponsor.delete({ where: { id } });
  }

  // Get sponsors filtered by status
  async findByStatus(status: SponsorStatus) {
    return this.prisma.sponsor.findMany({
      where: {
        status: status,
      },
    });
  }

  // Get sponsors filtered by name
  async findByName(name: string) {
    return this.prisma.sponsor.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
  }
}
