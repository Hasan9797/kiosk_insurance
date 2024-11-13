import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common'
import { PartnerService } from './partner.service'
import { CreatePartnerDTO, UpdatePartnerDTO } from './dto'
import { ApiTags } from '@nestjs/swagger'
import { diskStorage } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express'
import { v4 as uuidv4 } from 'uuid'

@ApiTags('Partner Service')
@Controller({
  version: '1',
  path: 'partners',
})
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.partnerService.findAll(query)
  }

  @Get('get-companies')
  findCompany() {
    return this.partnerService.getCompanies()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.partnerService.findOne(+id)
  }

  @Patch(':id/change-status')
  changePartnerStatus(@Param('id') id: number, @Query('status') status: number) {
    return this.partnerService.updatePartnerStatus(+id, status)
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/logo',
        filename: (req, file, cb) => {
          const uuid = uuidv4()
          const filename = `${uuid}-${file.originalname.replace(/\s+/g, '')}`
          cb(null, filename)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|svg)$/)) {
          return cb(new BadRequestException('Invalid file type'), false)
        }
        cb(null, true)
      },
    }),
  )
  create(@Body() data: CreatePartnerDTO, @UploadedFile() file: Express.Multer.File) {
    return this.partnerService.create(data, file)
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/logo',
        filename: (req, file, cb) => {
          const uuid = uuidv4()
          const filename = `${uuid}-${file.originalname.replace(/\s+/g, '')}`
          cb(null, filename)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|svg\+xml)$/)) {
          return cb(new BadRequestException('Invalid file type'), false)
        }
        cb(null, true)
      },
    }),
  )
  update(@Param('id') id: number, @Body() data: UpdatePartnerDTO, @UploadedFile() file: Express.Multer.File) {
    return this.partnerService.update(+id, data, file)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(+id)
  }
}
