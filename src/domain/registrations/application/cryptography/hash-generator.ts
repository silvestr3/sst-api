export abstract class HashGenerator {
  abstract hash(text: string): Promise<string>;
}
