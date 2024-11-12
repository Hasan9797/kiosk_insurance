import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { DepositService } from './deposit.service'
import { CreateDepositDTO, UpdateFcmTokenDTO } from './dto'
import { ApiTags } from '@nestjs/swagger'
import { CheckTokenGuard } from 'guards'
import { CustomRequest } from 'custom'
import { QueryParams } from '@interfaces'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'

@ApiTags('Deposits Service')
@Controller({
  version: '1',
  path: 'deposits',
})
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Get()
  findAll(@Query() query: QueryParams) {
    return this.depositService.findAll(query)
  }

  @UseGuards(CheckTokenGuard)
  @Get('deposit-static')
  findIncasatorDeposit(@Req() request: CustomRequest, @Query() query: any) {
    return this.depositService.findDepositStatic(request?.user?.id, query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositService.findOne(+id)
  }

  @UseGuards(CheckTokenGuard)
  @Post()
  create(@Body() createDepositDto: CreateDepositDTO, @Req() request: CustomRequest) {
    return this.depositService.create(createDepositDto, request?.user?.id)
  }

  @Post('notify')
  sendNotification(@Body() dto: any) {
    return this.depositService.sendNotification(dto)
  }

  @UseGuards(CheckTokenGuard)
  @Post(':id')
  @UseInterceptors(
    FileInterceptor('chekPhoto', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uuid = uuidv4()
          const filename = `${uuid}-${file.originalname.replace(/\s+/g, '')}`
          cb(null, filename)
        },
      }),
      // fileFilter: (req, file, cb) => {
      //   if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
      //     return cb(new BadRequestException('Invalid file type'), false)
      //   }
      //   cb(null, true)
      // },
    }),
  )
  update(
    @Param('id') id: string,
    @Req() request: CustomRequest,
    @Body() updateDepositDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.depositService.update(+id, request?.user?.id, updateDepositDto, file)
  }

  @UseGuards(CheckTokenGuard)
  @Post('update/fcm-token')
  updateFcmToken(@Body() body: UpdateFcmTokenDTO, @Req() request: CustomRequest) {
    return this.depositService.updateFcmToken(body, request?.user?.id)
  }

  @Patch('status-update/:id')
  updateAccountant(@Param('id') id: number, @Body() dto: any) {
    return this.depositService.updateDepositAccountant(+id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.depositService.remove(+id)
  }
}
