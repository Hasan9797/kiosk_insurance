import { CreatePartnerRequest } from '@interfaces'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePartnerDTO implements CreatePartnerRequest {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  partnerId: number

  @IsNotEmpty()
  @IsNumber()
  status: number

  @IsNotEmpty()
  @IsNumber()
  limitedAmountInRegion: number

  @IsNotEmpty()
  @IsNumber()
  limitedAmountTashkent: number

  @IsNotEmpty()
  @IsNumber()
  unLimitedAmountInRegion: number

  @IsNotEmpty()
  @IsNumber()
  unLimitedAmountTashkent: number
}
