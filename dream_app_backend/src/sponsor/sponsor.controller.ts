import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SponsorService } from "./sponsor.service";
import { CreateSponsorDto } from "./sponsor.dto";
import { UpdateSponsorDto } from "./sponsor.dto";
import { SponsorStatus } from "@prisma/client";
import { RoleGuard,  Roles, UserRoles } from 'src/role.guard';
import { JwtAuthGuard } from 'src/jwt-auth.guard';


@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(UserRoles.ADMIN)
@Controller("sponsor")
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  // Get all sponsors
  @Get()
  findAll() {
    return this.sponsorService.findAll();
  }

  // Get sponsors by status
  @Get("status")
  async getSponsorsByStatus(@Query("status") status: SponsorStatus) {
    return this.sponsorService.findByStatus(status);
  }

  // Get sponsors by name
  @Get("name")
  async getSponsorsByName(@Query("name") name: string) {
    return this.sponsorService.findByName(name);
  }

  // Get a single sponsor by ID
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.sponsorService.findOne(+id);
  }

  // Create a new sponsor
  @Post()
  create(
    @Body()
    createSponsorDto: CreateSponsorDto
  ) {
    return this.sponsorService.create(createSponsorDto);
  }

  // Update a sponsor by ID
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body()
    updateSponsorDto: UpdateSponsorDto
  ) {
    return this.sponsorService.update(+id, updateSponsorDto);
  }

  // Delete a sponsor by ID
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.sponsorService.delete(+id);
  }
}
