import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PlaygroundResolver } from './playground.resolver';

@Module({
  imports: [],
  providers: [
    PlaygroundResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [],
})
export class PlaygroundModule {}
