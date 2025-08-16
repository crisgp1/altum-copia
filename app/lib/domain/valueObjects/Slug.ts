export class Slug {
  private readonly _value: string;

  constructor(value: string) {
    this._value = this.generate(value);
  }

  get value(): string {
    return this._value;
  }

  private generate(text: string): string {
    if (!text || typeof text !== 'string') {
      throw new Error('Slug text must be a non-empty string');
    }
    
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }

  static fromText(text: string): Slug {
    return new Slug(text);
  }

  equals(other: Slug): boolean {
    return this._value === other.value;
  }

  toString(): string {
    return this._value;
  }
}