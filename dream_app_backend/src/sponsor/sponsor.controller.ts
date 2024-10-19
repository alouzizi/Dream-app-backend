import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { SponsorService } from "./sponsor.service";
import { CreateSponsorDto } from "./sponsor.dto";
import { UpdateSponsorDto } from "./sponsor.dto";
import { SponsorStatus } from "@prisma/client";
import { RoleGuard, Roles, UserRoles } from "src/role.guard";
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import * as fs from "fs";

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
  @UseInterceptors(
    FileInterceptor("logo", {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(
            new HttpException(
              "Invalid file type. Only JPG and PNG are allowed.",
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        }
        callback(null, true);
      },
    })
  )
  create(
    @Body()
    createSponsorDto: CreateSponsorDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    let logoPath = null;

    if (logo) {
      const uploadDir = "./uploads/logos";

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Create a unique file path
      logoPath = path.join(uploadDir, `${Date.now()}-${logo.originalname}`);

      // Write file to disk
      fs.writeFileSync(logoPath, logo.buffer);
    }

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
