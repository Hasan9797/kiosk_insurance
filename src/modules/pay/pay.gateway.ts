import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { PayService } from './pay.service'
import { Req, UseGuards } from '@nestjs/common'
import { CheckTokenGuard } from 'guards'
import { CustomRequest } from 'custom'

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class PayGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  constructor(private readonly payService: PayService) {}

  afterInit(server: Server) {
    console.log('Socket server initialized')
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`)
  }

  @UseGuards(CheckTokenGuard)
  @SubscribeMessage('pay')
  async handlePayment(@MessageBody() data: any, @Req() request: CustomRequest): Promise<any> {
    this.payService.saveEveryCash(data, request?.user?.id)
    // console.log('salam')
    this.server.emit('payResponse', { amount: 'salam' })
  }
}
