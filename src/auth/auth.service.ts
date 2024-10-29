import { jwtConstants } from '@constants'
import { LoginRequest, LoginResponse } from '@interfaces'
import { UsersService } from '@modules'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { signJwt, verifyJwt } from '@helpers'
import { PrismaService } from 'prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { ErrorCodes } from '@enums'
import { isJWT } from 'class-validator'

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
      60 * 60 * 24 * 7,
    )

    const refreshToken = signJwt(
      {
        id: user?.id,
        login: user?.login,
      },
      jwtConstants.secret,
      60 * 60 * 24 * 10,
    )

    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshToken(token: string, userId: number) {
    if (!token || !isJWT(token)) {
      throw new UnauthorizedException(ErrorCodes.ACCESS_TOKEN_NOT_VALID)
    }

    const verified = verifyJwt(token, jwtConstants.secret)

    const user = await this.prisma.user.findUnique({
      where: {
        id: verified.id,
      },
    })

    if (!user || !(userId === user.id)) {
      throw new UnauthorizedException(ErrorCodes.UNAUTHORIZED)
    }

    console.log(user)

    const accessToken = signJwt(
      {
        id: user?.id,
        login: user?.login,
      },
      jwtConstants.secret,
      60 * 60 * 24 * 7,
    )

    const refreshToken = signJwt(
      {
        id: user?.id,
        login: user?.login,
      },
      jwtConstants.secret,
      60 * 60 * 24 * 10,
    )

    return {
      accessToken,
      refreshToken,
    }
  }
}
