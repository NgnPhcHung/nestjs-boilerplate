import { Injectable, OnModuleInit } from '@nestjs/common';
import { TrieNode } from './trie';
import { RedisService } from '@modules/redis/redis.service';

@Injectable()
export class TrieService implements OnModuleInit {
  private trieRoot: TrieNode = new TrieNode();

  constructor(private readonly redisService: RedisService) {}

  async onModuleInit() {
    await this.loadFromRedisToTrie();
  }

  insert(word: string) {
    let node = this.trieRoot;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }

    node.isEndOfWord = true;
  }

  search(word: string) {
    let node = this.trieRoot;
    for (const char of word) {
      if (!node.children.has(char)) {
        return false;
      }
      node = node.children.get(char);
    }
    return node.isEndOfWord;
  }

  startsWith(prefix: string) {
    const result: string[] = [];
    let node = this.trieRoot;

    for (const char of prefix) {
      if (!node.children.has(char)) {
        return result;
      }
      node = node.children.get(char);
    }

    this.dfs(node, prefix, result);

    return result;
  }

  private dfs(node: TrieNode, prefix: string, result: string[]) {
    if (result.length >= 10) return;

    if (node.isEndOfWord) {
      result.push(prefix);
    }

    const sortedChildren = Array.from(node.children.entries()).sort(
      ([charA], [charB]) => charA.localeCompare(charB),
    );

    for (const [char, child] of sortedChildren) {
      this.dfs(child, prefix + char, result);
    }
  }

  async loadFromRedisToTrie() {
    const usernames = await this.redisService.getSet<string>(
      this.redisService.USERNAMES_SET_KEY,
    );
    usernames.forEach((u) => {
      this.insert(u);
    });
  }

  async generateUsernameWithSuffix(baseUsername: string): Promise<string[]> {
    const suggestions: string[] = [];
    const tried = new Set();
    while (suggestions.length < 3 && tried.size < 1000) {
      const randomSuffix = Math.floor(Math.random() * 1000);
      if (tried.has(randomSuffix)) continue;

      tried.add(randomSuffix);
      const newUsername = `${baseUsername}${randomSuffix}`;
      const exist = await this.redisService.isUsersExist(newUsername);
      if (!exist) suggestions.push(newUsername);
    }
    return suggestions;
  }
}
