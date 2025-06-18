export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord = false;
}
