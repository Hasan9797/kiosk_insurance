import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { isJWT } from 'class-validator'
import { ErrorCodes } from '@enums'
import { verifyJwt } from '@helpers'
import { jwtConstants } from '@constants'
import { CustomRequest } from 'custom/request.custom'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class CheckTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>()

    const type = context.getType()

    let accessToken: string | undefined

    if (type === 'http') {
      const request = context.switchToHttp().getRequest<CustomRequest>()
      accessToken = request.headers.authorization?.replace(/^(bearer)\s/i, '')
    } else if (type === 'ws') {
      const client = context.switchToWs().getClient()
      console.log(client.handshake.headers)

      accessToken = client.handshake.headers.authorization
    }

    // const accessToken = request.headers.authorization?.replace(/^(bearer)\s/i, '')

    console.log(accessToken)

    if (!accessToken || !isJWT(accessToken)) {
      throw new UnauthorizedException(ErrorCodes.ACCESS_TOKEN_NOT_VALID)
    }

    const verified = verifyJwt(accessToken, jwtConstants.secret)

    // const user = await this.usersRepository.findOne({
    //   where: { login: verified.login },
    //   relations: { permissions: true },
    // })

    const user = await this.prisma.user.findUnique({
      where: {
        id: verified.id,
      },
    })

    console.log(user)

    if (!user) {
      throw new UnauthorizedException(ErrorCodes.UNAUTHORIZED)
    }

    request.user = verified

    return true
  }
}
