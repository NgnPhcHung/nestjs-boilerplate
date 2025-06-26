import multiavatar from '@multiavatar/multiavatar';
import { Inject } from '@nestjs/common';
import {
  Mutation,
  Args,
  Float,
  Resolver,
  Subscription,
  Query,
  Int,
} from '@nestjs/graphql';
import { loadImage, createCanvas } from 'canvas';
import { PubSubEngine } from 'graphql-subscriptions';
import { Player } from './dtos/playground.model';
import { RedisService } from '@modules/redis/redis.service';

@Resolver(() => Player)
export class PlaygroundResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
    private redisSerivce: RedisService,
  ) {}

  private async generateRandomAvatar(): Promise<string> {
    const seed = Math.random().toString(36).substring(2, 10);
    const svg = multiavatar(seed, true);
    const fixedSvg = svg.replace('<svg', '<svg width="64" height="64"');

    const svgBase64 = Buffer.from(fixedSvg).toString('base64');
    const svgUrl = `data:image/svg+xml;base64,${svgBase64}`;
    const img = await loadImage(svgUrl);

    const canvas = createCanvas(64, 64);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 64, 64);

    const base64 = canvas.toDataURL('image/png');
    return base64;
  }

  @Query(() => [Player])
  async players(): Promise<Player[]> {
    const players = await this.redisSerivce.getList<Player>('new_room');

    return players;
  }

  @Mutation(() => Player)
  async userJoinPlayground(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Player> {
    const existedUser = await this.redisSerivce.getHashKey<Player>(
      'new_room',
      userId.toString(),
    );

    console.log('---------------');

    if (existedUser) {
      return existedUser;
    }

    const newPlayer = {
      userId,
      avatarImg: await this.generateRandomAvatar(),
      position: { x: 100, y: 100 },
    };

    await this.redisSerivce.pushToList('new_room', newPlayer);
    await this.pubSub.publish('USER_JOIN', { userJoined: { userId } });
    return newPlayer;
  }

  @Mutation(() => Player)
  async updatePlayerPosition(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('x', { type: () => Float }) x: number,
    @Args('y', { type: () => Float }) y: number,
  ): Promise<Player> {
    let currentPlayer = await this.redisSerivce.getData(`player:${userId}`);

    if (!currentPlayer) {
      const avatarImg = await this.generateRandomAvatar();
      currentPlayer = {
        userId,
        position: { x, y },
        avatarImg,
      };
      console.log(`New player joined game: ${userId}`);
    } else {
      currentPlayer.position = { x, y };
    }

    this.players[userId] = currentPlayer;

    console.log({ userId, x, y });
    await this.pubSub.publish('PLAYER_MOVED', { playerMoved: currentPlayer });
    return currentPlayer;
  }

  @Subscription(() => Player, {
    resolve: (value) => value.userJoined,
  })
  userJoined() {
    return this.pubSub.asyncIterableIterator('USER_JOIN');
  }

  @Subscription(() => Player, {
    resolve: (payload) => {
      return payload.playerMoved;
    },
    filter: (payload, variables) => {
      return payload.playerMoved.id !== variables.currentUserId;
    },
  })
  userMoved() {
    return this.pubSub.asyncIterableIterator('PLAYER_MOVED');
  }
}
