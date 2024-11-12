import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { RequestModule } from 'gateRequest'
import {
  UsersModule,
  CompanyModule,
  PayModule,
  BankModule,
  RegionModule,
  DepositModule,
  PartnerModule,
  StructureModule,
  UserBalanceModule,
  BalanceHistoryModule,
} from '@modules'
import { pspConfig } from '@config'
import { AuthModule } from 'auth/auth.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import * as admin from 'firebase-admin'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [pspConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    RequestModule,
    UsersModule,
    CompanyModule,
    PayModule,
    AuthModule,
    BankModule,
    RegionModule,
    PartnerModule,
    StructureModule,
    DepositModule,
    UserBalanceModule,
    BalanceHistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class App {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_SENDER_ID,
        privateKey: process.env.FIREBASE_SENDER_TOKEN.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_SENDER_EMAIL,
      }),
    })
  }
}
