import { jwtConstants } from '@constants'
import { LoginRequest, LoginResponse } from '@interfaces'
import { UsersService } from '@modules'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { signJwt } from 'helpers/jwt.helper'
import { PrismaService } from 'prisma/prisma.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly prisma: PrismaService,
  ) {}

  async login(data: LoginRequest): Promise<LoginResponse> {
    const user = await this.usersService.validate({ login: data.login })

    const isMatch = await bcrypt.compare(data.password, user.password)

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = signJwt(
      {
        id: user?.id,
        login: user?.login,
      },
      jwtConstants.secret,
      60 * 60 * 9,
    )

    return {
      accessToken,
    }
  }
}
