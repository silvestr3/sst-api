export abstract class Repository<T> {
  abstract findById(id: string): Promise<T | null>;
}
