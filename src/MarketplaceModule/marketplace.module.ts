import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ItemService } from './service/item.service';
import { ItemController } from './controller/item.controller';
import * as AWS from 'aws-sdk';

const SQS = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-2' });

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: 'createOrder',
          queueUrl: process.env.CREATE_ORDER_QUEUE_URL,
          sqs: SQS, // instance of new AWS.SQS
          waitTimeSeconds: 1,
          batchSize: 1,
          terminateVisibilityTimeout: true,
          messageAttributeNames: ['All'],
        },
      ],
      producers: [
        {
          name: 'createOrder',
          queueUrl: process.env.CREATE_ORDER_QUEUE_URL,
          sqs: SQS,
        },
      ],
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService],
})
export class MarketplaceModule {}
