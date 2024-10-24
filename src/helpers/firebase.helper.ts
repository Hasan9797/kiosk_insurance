import * as admin from 'firebase-admin'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FirebaseService {
  // constructor() {
  //   admin.initializeApp({
  //     credential: admin.credential.cert({
  //       projectId: process.env.FIREBASE_SENDER_ID,
  //       clientEmail: process.env.FIREBASE_SENDER_TOKEN.replace(/\\n/g, '\n'),
  //       privateKey: process.env.FIREBASE_SENDER_EMAIL,
  //     }),
  //   });
  // }

  async sendPushNotification(token: string, title: string, body: string) {
    const message = {
      notification: {
        title,
        body,
      },
      token,
    }

    try {
      await admin.messaging().send(message)
      console.log('Push notification sent successfully')
    } catch (error) {
      console.error('Error sending push notification:', error)
    }
  }
}
