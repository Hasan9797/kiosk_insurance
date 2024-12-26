import { Module } from '@nestjs/common'
import { CashbackService } from './cashback.service'
import { CashbackController } from './cashback.controller'
import { PrismaModule } from 'prisma/prisma.module'

@Module({
  controllers: [CashbackController],
  providers: [CashbackService],
  imports: [PrismaModule],
})
export class CashbackModule {}
