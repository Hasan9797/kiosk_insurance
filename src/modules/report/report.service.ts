import { RegionStatus, RegionStatusOutPut, UserRoles } from '@enums';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return `This action returns all report`;
  }

  async reportByRegion() {
    const data = await this.prisma.region.findMany(
      {
        where: {
          deletedAt: {
            equals: null
          }
        },
        include: {
          structures: {
            where: {
              deletedAt: {
                equals: null
              }
            },
            include: {
              user: {
                where: {
                  deletedAt: {
                    equals: null
                  }
                },
                include: {
                  userBalances: true
                }
              }
            }
          }
        }
      }
    )

    const filterOperators = data?.reduce((acc, region) => {
      region?.structures?.map((structure) => {
        structure?.user?.map((user) => {
          if (user.role == UserRoles.OPERATOR) {
            acc.push(user)
          }
        })
      })
      return acc
    }, [])

    const balance = filterOperators.reduce((acc, operator) => {
      console.log(operator);

      acc += operator?.userBalances.balance || 0
      return acc
    }, 0)

    console.log(balance);


    const result: any = []

    data?.map((region) => {
      result.push(
        {
          id: region?.id,
          region: region?.name,
          status: {
            int: region?.status,
            string: RegionStatusOutPut[RegionStatus[region?.status] as keyof typeof RegionStatusOutPut],
          },
          countOfStructures: region?.structures.length,
          countOfOperators: 1,
          balanceOperators: 1
        }
      )
    })

    // console.log(result);


    return result

    /*
      data: [
        {
          id: 1
          region: name,
          status: niamdirda,
          amountOfStructures: 100
          amountOfoperator: 4101,
          totalbalanceOfoperator: 100000

        }
      ]
    */

  }
  async reportByStructure() { }
  async reportByUser() { }
  async reportByUserBalance() { }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

}


//region bo'yicha, structure bo'yicha, userlar bo'yicha, user balancelar bo'yicha