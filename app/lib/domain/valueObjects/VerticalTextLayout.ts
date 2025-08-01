export interface TextDimensions {
  width: number;
  height: number;
}

export interface ContainerDimensions {
  width: number;
  height: number;
  topMargin: number;
  bottomMargin: number;
}

export class VerticalTextLayout {
  private constructor(
    private readonly _fontSize: number,
    private readonly _letterSpacing: number,
    private readonly _maxHeight: number,
    private readonly _centerPosition: number
  ) {}

  static create(
    text: string,
    containerHeight: number,
    baseLetterSpacing: number = 0.3
  ): VerticalTextLayout {
    const availableHeight = containerHeight - 80; // 40px margin top and bottom
    const centerPosition = containerHeight / 2;
    
    // Calculate effective length including spaces (spaces take less vertical space)
    const characterCount = text.length;
    const spaceCount = (text.match(/\s/g) || []).length;
    // Spaces in vertical text take about 60% of a normal character's space
    const effectiveLength = characterCount - spaceCount + (spaceCount * 0.6);
    
    // Calculate optimal font size based on effective text length and available space
    const optimalFontSize = Math.min(
      Math.max(10, availableHeight / (effectiveLength * 1.1)), // Min 10px, scale with effective length
      16 // Max 16px for better readability
    );

    // Adjust letter spacing based on font size to maintain readability
    const adjustedLetterSpacing = baseLetterSpacing * (optimalFontSize / 16);

    return new VerticalTextLayout(
      optimalFontSize,
      adjustedLetterSpacing,
      availableHeight,
      centerPosition
    );
  }

  get fontSize(): number {
    return this._fontSize;
  }

  get letterSpacing(): string {
    return `${this._letterSpacing}em`;
  }

  get maxHeight(): number {
    return this._maxHeight;
  }

  get centerPosition(): number {
    return this._centerPosition;
  }

  get cssStyles(): React.CSSProperties {
    return {
      fontSize: `${this._fontSize}px`,
      letterSpacing: this.letterSpacing,
      maxHeight: `${this._maxHeight}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    };
  }

  calculateTextHeight(text: string): number {
    const characterCount = text.length;
    const spaceCount = (text.match(/\s/g) || []).length;
    const effectiveLength = characterCount - spaceCount + (spaceCount * 0.6);
    // Approximate height calculation for vertical text
    return effectiveLength * (this._fontSize * 1.1 + this._letterSpacing * 16);
  }

  willTextFit(text: string): boolean {
    return this.calculateTextHeight(text) <= this._maxHeight;
  }
}