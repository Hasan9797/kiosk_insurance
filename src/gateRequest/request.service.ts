import { Injectable, HttpException, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import * as crypto from 'crypto'
import { REQUEST_ERRORS } from '@enums'
import { GetInsuranceIds } from '@interfaces'

@Injectable()
export class InfinityRequestService {
  private response: any
  private method: string
  private params: any
  private errorUnknown: any
  private serviceKey: string
  private serviceId: string
  private url: string

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // So'rovni yuborish
  async send() {
    const jsonPayload = this.getRequest()

    const url = this.getUrl()
    const authHeader = this.generateForAuth()

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, jsonPayload, {
          headers: {
            'Content-Type': 'application/json',
            'Auth': authHeader,
          },
          timeout: 30000,
        }),
      )

      this.response = response.data

      if (this.getError()) {
        throw new BadRequestException(this.getErrorMessage())
      }

      // this.response = {
      //   "id": 207,
      //   "error": null,
      //   "result": {
      //     "masked_phone_number": "+99890*****50",
      //     "time_out": 120,
      //     "confirm_form": [
      //       {
      //         "label": "Код подтверждения",
      //         "key": "confirmation_code",
      //         "element": "input",
      //         "type": "int",
      //         "value": "",
      //         "mask": "######",
      //         "regex": "^[0-9]{6}$",
      //         "placeholder": "",
      //         "size": 6,
      //         "order": 10,
      //         "is_required": 1
      //       },
      //       {
      //         "key": "bank_transaction_id",
      //         "value": 6236,
      //         "show": 0,
      //         "is_required": 1
      //       }
      //     ],
      //     "request_method": "pam.confirm_pay"
      //   }
      // }

      // this.response = {
      //   "method": "pam.confirm_pay",
      //   "params": {
      //     "confirm_form": {
      //       "confirmation_code": "000000",
      //       "bank_transaction_id": 127
      //     }
      //   },
      //   "id": 207
      // }

      // this.response = {
      //   "id": 207,
      //   "error": null,
      //   "result": {
      //     "details": {
      //       "id": "8g78g88d7gdq5ytq89utyq45",
      //       "masked_card_number": "860053******9500",
      //       "transaction_id": 4534534,
      //       "bank_transaction_id": 6845346,
      //       "reference_number": 5464563454,
      //       "amount": 1000,
      //       "merchantId": 33005329,
      //       "terminalId": 33004331,
      //       "date": 12425135346
      //     }
      //   }
      // }

      if (!this.response) {
        this.setErrorUnknown({
          code: REQUEST_ERRORS.INVALID_ANSWER,
          message: REQUEST_ERRORS.UNKNOWN_RESPONSE_ERROR,
        })
      }

      return this
    } catch (error: any) {
      if (error.response) {
        throw new HttpException(`AXIOS request failed: ${error.message}`, error.response.status)
      } else {
        throw new InternalServerErrorException('AXIOS request failed: ' + error.message)
      }
    }
  }

  // Parametrlarni set qilish
  setParams(params: any): InfinityRequestService {
    this.params = params
    return this
  }

  setServiceKey(params: string): InfinityRequestService {
    this.serviceKey = params
    return this
  }

  setServiceId(params: string): InfinityRequestService {
    this.serviceId = params
    return this
  }

  setUrl(params: string): InfinityRequestService {
    this.url = params
    return this
  }

  // Javobni saqlash
  setResponse(response: any): InfinityRequestService {
    this.response = response
    return this
  }

  // Xato haqida ma'lumot berish
  setErrorUnknown(error: any) {
    this.errorUnknown = error
  }

  getParams(): any {
    return this.params || {}
  }

  getUrl(): any {
    return this.url || ''
  }

  setMethod(method: string): InfinityRequestService {
    this.method = method
    return this
  }

  getMethod(): string {
    return this.method || null
  }

  generateId(): number {
    return Math.floor(Math.random() * 1000)
  }

  // Authorization header generatsiya qilish
  private generateForAuth(): string {
    const timestamp = Date.now()

    const hash = crypto
      .createHash('sha1')
      .update(this.serviceKey + timestamp)
      .digest('hex')

    const authHeader = `${this.serviceId}-${hash}-${timestamp}`

    return authHeader
  }

  getResponse(): any {
    return this.response || {}
  }

  getResult(): any {
    return this.response?.result || []
  }

  getInsuranceIds(): GetInsuranceIds {
    const result = {
      order_id: this?.response?.result?.order_id,
      anketa_id: this?.response?.result?.anketa_id,
      polis_id: this?.response?.result?.polis_id,
      vendor_id: this?.response?.result?.pay?.params?.vendor_id,
    }
    return result
  }

  getError(): any {
    return this.response?.error.message || this.errorUnknown
  }

  getErrorMessage(): string {
    return this.response.error.message || this.errorUnknown
  }

  getErrorUnknown(): any {
    return this.errorUnknown || { message: 'Unknown error' }
  }

  isOk(): boolean {
    return !this.getError()
  }

  getResultSms(): any {
    const confirmSms = this.getResult()?.confirm_form || []

    if (!confirmSms || !Array.isArray(confirmSms)) {
      throw new Error('confirm_form is not an array or is undefined.')
    }

    const foundItem = confirmSms.find((item) => item?.key === 'transaction_id')
    return foundItem ? foundItem.value : null
  }

  getResultCheckPay(): any {
    const result = this.getResult() || []

    if (!result || !Array.isArray(result)) {
      throw new Error('Result is not an array or is undefined.')
    }

    const foundItem = result.find((item) => item?.request_method === 'pam.prepare_pay')
    return foundItem || null
  }

  getDetails(): any {
    return this.response?.result?.details || []
  }

  // So'rov tayyorlash
  getRequest(): any {
    return {
      jsonrpc: '2.0',
      id: this.generateId(),
      method: this.getMethod(),
      params: this.getParams(),
    }
  }
}
