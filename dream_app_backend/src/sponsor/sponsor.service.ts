import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { SponsorStatus } from "@prisma/client";

@Injectable()
export class SponsorService {
  constructor(private prisma: PrismaClient) {}

  // Fetch all sponsors
  async findAll() {
    return this.prisma.sponsor.findMany();
  }

  // Fetch a single sponsor by ID
  async findOne(id: number) {
    return this.prisma.sponsor.findUnique({ where: { id } });
  }

  // Create a new sponsor
  async create(data: { name: string; logo: string; status: SponsorStatus }) {
    return this.prisma.sponsor.create({ data });
  }

  // Update a sponsor by ID
  async update(
    id: number,
    data: { name?: string; logo?: string; status?: SponsorStatus }
  ) {
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
      mode: 'insensitive',
		},
	  },
	});
  }
}
