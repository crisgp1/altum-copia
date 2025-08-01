import { TextOrientation } from '../valueObjects/TextOrientation';
import { VerticalTextLayout } from '../valueObjects/VerticalTextLayout';

export class TextOrientationService {
  static getAttorneyNameOrientation(): TextOrientation {
    return TextOrientation.createVerticalTopToBottom();
  }

  static getVerticalTextStyles(orientation: TextOrientation): React.CSSProperties {
    return {
      ...orientation.cssStyles,
      height: 'auto',
      maxHeight: 'calc(100% - 80px)',
      maxWidth: '20px',
      overflow: 'hidden'
    };
  }

  static calculateOptimalLayout(
    text: string, 
    containerHeight: number
  ): VerticalTextLayout {
    // Keep spaces and punctuation - they're part of the name
    return VerticalTextLayout.create(text, containerHeight);
  }

  static getAutoAdjustingVerticalStyles(
    text: string,
    containerHeight: number,
    leftPosition: number
  ): React.CSSProperties {
    const orientation = this.getAttorneyNameOrientation();
    const layout = this.calculateOptimalLayout(text, containerHeight);
    
    return {
      position: 'absolute' as const,
      left: `${leftPosition}px`,
      top: '50%',
      transform: 'translateY(-50%)',
      writingMode: orientation.writingMode,
      textOrientation: 'mixed' as const,
      transformOrigin: 'center',
      width: '20px',
      maxWidth: '20px',
      height: `${layout.maxHeight}px`,
      maxHeight: `${layout.maxHeight}px`,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${layout.fontSize}px`,
      letterSpacing: layout.letterSpacing,
      whiteSpace: 'normal' as const,
      wordSpacing: 'normal' as const,
      zIndex: 10
    };
  }

}