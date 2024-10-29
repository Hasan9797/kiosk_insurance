import { PreparePayCardRequest } from '@interfaces'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class PreparePayCardDTO implements PreparePayCardRequest {
  @IsNotEmpty()
  @IsString()
  amount: string

  @IsNotEmpty()
  @IsString()
  anketa_id: string

  @IsNotEmpty()
  @IsString()
  phone_number: string

  @IsOptional()
  @IsString()
  vendor_id?: number
}
