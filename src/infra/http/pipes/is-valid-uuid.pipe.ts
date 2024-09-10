import { ArgumentMetadata, ParseUUIDPipe } from '@nestjs/common';

export class IsValidUUIDPipe extends ParseUUIDPipe {
  constructor(private paramName: string) {
    super();
  }

  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    try {
      return await super.transform(value, metadata);
    } catch {
      throw this.exceptionFactory(
        `${this.paramName} is expected to be an UUID`,
      );
    }
  }
}
