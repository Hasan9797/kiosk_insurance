import { FindAllUserResponse } from '@interfaces'
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { UserRoles, UserRolesOutPut, Pagination } from '@enums'
import * as bcrypt from 'bcrypt'
import { FilterService, paginationResponse } from '@helpers'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: any): Promise<FindAllUserResponse> {
    const { limit = Pagination.LIMIT, page = Pagination.PAGE, sort, filters } = query

    const parsedSort = sort ? JSON?.parse(sort) : {}

    const parsedFilters = filters ? JSON?.parse(filters) : []

    const users = await FilterService?.applyFilters('user', parsedFilters, parsedSort, limit, page)

    const usersWithRoles = users.map((user: any) => ({
      ...user,
      role: {
        int: user.role,
        string: UserRolesOutPut[UserRoles[user.role] as keyof typeof UserRolesOutPut],
      },
    }))

    for (const user of usersWithRoles) {
      delete user.password
    }

    const pagination = paginationResponse(users.length, limit, page)

    return {
      data: usersWithRoles,
      pagination,
    }
  }

  async getOperators(): Promise<FindAllUserResponse> {
    const operators = await this.prisma.user.findMany({
      where: {
        role: UserRoles.OPERATOR,
        deletedAt: {
          equals: null,
        },
      },
    })

    const operatorsWithRoles = operators.map((accountant: any) => ({
      ...accountant,
      role: {
        int: accountant.role,
        string: UserRolesOutPut[UserRoles[accountant.role] as keyof typeof UserRolesOutPut],
      },
      accountant,
    }))

    for (const operator of operatorsWithRoles) {
      delete operator.password
    }
    return {
      data: operatorsWithRoles,
    }
  }

  async getAccountans(): Promise<FindAllUserResponse> {
    const accountants = await this.prisma.user.findMany({
      where: {
        role: UserRoles.ACCOUNTANT,
        deletedAt: {
          equals: null,
        },
      },
    })

    const accountantWithRoles = accountants.map((accountant: any) => ({
      ...accountant,
      role: {
        int: accountant.role,
        string: UserRolesOutPut[UserRoles[accountant.role] as keyof typeof UserRolesOutPut],
      },
      accountant,
    }))

    for (const user of accountantWithRoles) {
      delete user.password
    }

    return {
      data: accountantWithRoles,
    }
  }

  async getIncasators(): Promise<FindAllUserResponse> {
    const incasators = await this.prisma.user.findMany({
      where: {
        role: UserRoles.INCASATOR,
        deletedAt: {
          equals: null,
        },
      },
    })

    const incasatorsWithRoles = incasators.map((incasator: any) => ({
      ...incasator,
      role: {
        int: incasator.role,
        string: UserRolesOutPut[UserRoles[incasator.role] as keyof typeof UserRolesOutPut],
      },
      incasator,
    }))

    for (const incasator of incasatorsWithRoles) {
      delete incasator.password
    }

    return {
      data: incasatorsWithRoles,
    }
  }

  async getOperatorsStatic(userId: number) {
    const operators = await this.prisma.user.findMany({
      where: {
        incasatorId: userId,
        deletedAt: {
          equals: null,
        },
      },
    })

    return {
      data: operators,
    }
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
        login: data?.login.toUpperCase(),
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

    const hashedPassword = await bcrypt.hash(data.password.toUpperCase(), saltOrRounds)

    const newUser = await this.prisma.user.create({
      data: {
        name: data?.name,
        login: data?.login.toUpperCase(),
        password: hashedPassword,
        code: code,
        role: data?.role,
        incasatorId: data?.incasatorId,
        longitude: data?.longitude,
        latitude: data?.latitude,
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
