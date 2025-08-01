export enum TextWritingMode {
  VERTICAL_RL = 'vertical-rl',
  VERTICAL_LR = 'vertical-lr',
  HORIZONTAL_TB = 'horizontal-tb'
}

export enum TextDirection {
  TOP_TO_BOTTOM = 'top-to-bottom',
  BOTTOM_TO_TOP = 'bottom-to-top',
  LEFT_TO_RIGHT = 'left-to-right',
  RIGHT_TO_LEFT = 'right-to-left'
}

export class TextOrientation {
  private constructor(
    private readonly _writingMode: TextWritingMode,
    private readonly _direction: TextDirection,
    private readonly _rotation: number = 0
  ) {}

  static createVerticalTopToBottom(): TextOrientation {
    return new TextOrientation(
      TextWritingMode.VERTICAL_RL,
      TextDirection.TOP_TO_BOTTOM,
      0
    );
  }

  static createVerticalBottomToTop(): TextOrientation {
    return new TextOrientation(
      TextWritingMode.VERTICAL_RL,
      TextDirection.BOTTOM_TO_TOP,
      180
    );
  }

  get writingMode(): TextWritingMode {
    return this._writingMode;
  }

  get direction(): TextDirection {
    return this._direction;
  }

  get rotation(): number {
    return this._rotation;
  }

  get cssTransform(): string {
    return this._rotation === 0 
      ? 'translateY(-50%)' 
      : `translateY(-50%) rotate(${this._rotation}deg)`;
  }

  get cssStyles(): React.CSSProperties {
    return {
      writingMode: this._writingMode,
      textOrientation: 'mixed' as const,
      transform: this.cssTransform,
      transformOrigin: 'center'
    };
  }
}