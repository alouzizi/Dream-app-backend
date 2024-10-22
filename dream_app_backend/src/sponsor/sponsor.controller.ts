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

import { FileInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import * as fs from "fs";
import { JwtAuthGuard } from "src/jwt-auth.guard";
import { Console } from "console";


@UseGuards( JwtAuthGuard, RoleGuard)
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
    //add logo path to the createSponsorDto
    createSponsorDto.logo = logoPath;

    return this.sponsorService.create(createSponsorDto);
  }

  // Update a sponsor by ID
  // @Patch(":id")
  // update(
  //   @Param("id") id: string,
  //   @Body()  updateSponsorDto: any
  // ) {
  //   console.log("id", id);
  //   console.log("updateSponsorDto", updateSponsorDto);
  //   return this.sponsorService.update(+id, updateSponsorDto);
  // }

  @Patch(":id")
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
  async update(
    @Param('id') id: string,
    @Body() updateSponsorDto: UpdateSponsorDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    console.log("id", id);
    // Get existing sponsor to check if there's an old logo to delete
      const existingSponsor = await this.sponsorService.findOne(+id);
      let logoPath = existingSponsor.logo; // Keep existing logo path by default

      if (logo) {
        const uploadDir = './uploads/logos';

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Delete old logo if it exists
        if (existingSponsor.logo && fs.existsSync(existingSponsor.logo)) {
          fs.unlinkSync(existingSponsor.logo);
        }

        // Create a unique file path for new logo
        logoPath = path.join(uploadDir, `${Date.now()}-${logo.originalname}`);
        // Write new file to disk
        fs.writeFileSync(logoPath, logo.buffer);
      }

      // Add new logo path to the updateSponsorDto
      updateSponsorDto.logo = logoPath;

      return this.sponsorService.update(+id, updateSponsorDto);
  }

  // Delete a sponsor by ID
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.sponsorService.delete(+id);
  }
}
