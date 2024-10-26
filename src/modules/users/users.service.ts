import { CreateUserRequest } from '@interfaces'
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { UserRoles, UserRolesOutPut } from '@enums'
import * as bcrypt from 'bcrypt'
import { FilterService } from '@helpers'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any) {
    const { limit, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    // const users = await FilterService?.applyFilters('user', parsedFilters, parsedSort)

    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: {
          equals: null,
        },
      },
    })

    const usersWithRoles = users.map((user) => ({
      ...user,
      role: UserRolesOutPut[UserRoles[user.role] as keyof typeof UserRolesOutPut],
    }))

    return {
      data: users,
    }
  }

  async getOperators() {
    const operators = await this.prisma.user.findMany({
      where: {
        role: UserRoles.OPERATOR,
        deletedAt: {
          equals: null,
        },
      },
    })
    return operators
  }

  async getAccountans() {
    const accountant = await this.prisma.user.findMany({
      where: {
        role: UserRoles.ACCOUNTANT,
        deletedAt: {
          equals: null,
        },
      },
    })
    return accountant
  }

  async getOperatorsStatic(userId: number) {
    const operators = await this.prisma.user.findMany(
      {
        where: {
          incasatorId: userId,
          deletedAt: {
            equals: null
          }
        }
      }
    )

    return {
      data: operators
    }
  }

  async getIncasators() {
    const incasators = await this.prisma.user.findMany({
      where: {
        role: UserRoles.INCASATOR,
        deletedAt: {
          equals: null,
        },
      },
    })
    return incasators
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User not found with given ID')
    }
    return {
      data: user,
    }
  }

  async create(data: any): Promise<void> {
    const saltOrRounds = 10

    const userExists = await this.prisma.user.findFirst({
      where: {
        login: data?.login,
      },
    })

    if (userExists) {
      throw new ConflictException('This login already in use!')
    }

    if (data.login.length > 15) {
      throw new BadRequestException('Login must be less than 15 characters')
    }

    if (data.login.length < 8) {
      throw new BadRequestException('Login must be more than 8 characters')
    }

    if (data.password.length > 12) {
      throw new BadRequestException('Password must be less than 12 characters')
    }

    if (data.password.length < 6) {
      throw new BadRequestException('Password must be more than 6 characters')
    }

    if (!Object.values(UserRoles).includes(data.role)) {
      throw new NotFoundException('Role not found!')
    }

    const count = await this.prisma.user.count({
      where: {
        role: data.role,
      },
    })

    const roleKey = Object.keys(UserRoles).find((key) => UserRoles[key as keyof typeof UserRoles] === data.role)

    const roleCapitalLetter = roleKey?.substring(0, 2).toUpperCase()

    const code = `${roleCapitalLetter}${count + 1}`

    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds)

    const newUser = await this.prisma.user.create({
      data: {
        name: data?.name,
        login: data?.login,
        password: hashedPassword,
        code: code,
        role: data?.role,
      },
    })

    await this.prisma.userBalance.create({
      data: {
        userId: newUser.id,
        balance: 0,
      },
    })
  }

  async update(id: number, data: any): Promise<void> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!userExists) {
      throw new NotFoundException('User not found with given ID!')
    }

    if (data.login && data.login.length > 15) {
      throw new BadRequestException('Login must be less than 15 characters!')
    }

    if (data.login && data.login.length < 8) {
      throw new BadRequestException('Login must be more than 8 characters!')
    }

    if (data.password && data.password.length > 12) {
      throw new BadRequestException('Password must be less than 12 characters!')
    }

    if (data.password && data.password.length < 6) {
      throw new BadRequestException('Password must be more than 6 characters!')
    }

    if (data.role && !Object.values(UserRoles).includes(data.role as UserRoles)) {
      throw new NotFoundException('Role not found!')
    }

    if (data.login && data.login !== userExists.login) {
      const loginTaken = await this.prisma.user.findFirst({
        where: {
          login: data.login,
          id: {
            not: id,
          },
          deletedAt: {
            equals: null,
          },
        },
      })

      if (loginTaken) {
        throw new ConflictException('This login already in use by another user!')
      }
    }

    let hashedPassword = userExists.password
    if (data.password) {
      const saltOrRounds = 10
      hashedPassword = await bcrypt.hash(data.password, saltOrRounds)
    }

    let code = userExists.code
    if (data.role && data.role !== userExists.role) {
      const count = await this.prisma.user.count({
        where: {
          role: data.role,
          deletedAt: {
            equals: null,
          },
        },
      })

      const roleCapitalLetter = data.role
        .split('_')
        .map((c: string, index: number, array: string[]) => {
          if (array.length > 1) {
            return c.charAt(0).toLocaleUpperCase()
          } else {
            return c.charAt(0).toLocaleUpperCase() + c.charAt(1).toLocaleUpperCase()
          }
        })
        .join('')

      code = `${roleCapitalLetter}${count + 1}`
    }

    await this.prisma.user.update({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
      data: {
        name: data?.name || userExists.name,
        login: data?.login || userExists.login,
        password: hashedPassword,
        code: code,
        role: data?.role || userExists.role,
      },
    })
  }

  async delete(id: number) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: id,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!userExists) {
      throw new NotFoundException('User not found with given ID!')
    }

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async validate(data: any) {
    const user = await this.prisma.user.findFirst({
      where: {
        login: data.login,
        deletedAt: {
          equals: null,
        },
      },
    })

    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    return {
      id: user?.id,
      login: user?.login,
      password: user?.password,
    }
  }
}
