import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, UseGuards } from '@nestjs/common'
import { NotificationService } from './notification.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateNotificationDTO, UpdateNotificationDTO } from './dto'
import { CustomRequest } from 'custom'
import { CheckTokenGuard } from '@guards'

@ApiTags('Notification Service')
@Controller({
  version: '1',
  path: 'notifications',
})
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(CheckTokenGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.notificationService.findAll(query)
  }

  @UseGuards(CheckTokenGuard)
  @Get('static')
  findStaticNotification(@Query() query: any, @Req() request: CustomRequest) {
    return this.notificationService.findStaticNotifications(query, request?.user?.id)
  }

  @UseGuards(CheckTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id)
  }

  @UseGuards(CheckTokenGuard)
  @Post()
  create(@Body() data: CreateNotificationDTO) {
    return this.notificationService.create(data)
  }

  @UseGuards(CheckTokenGuard)
  @Post('for-all-incasator')
  createNotificationForAllincasator(data: Omit<CreateNotificationDTO, 'userId'>) {
    return this.notificationService.sendNotificationAllUser(data)
  }
}
