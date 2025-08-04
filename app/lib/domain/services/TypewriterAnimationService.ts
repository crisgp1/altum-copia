import { gsap } from 'gsap';

export interface TypewriterConfig {
  text: string;
  container: HTMLElement;
  delay?: number;
  charDuration?: number;
  staggerDelay?: number;
  onComplete?: () => void;
}

export class TypewriterAnimationService {
  private static createCharacterElements(text: string, container: HTMLElement): HTMLSpanElement[] {
    if (!container) return [];
    
    // Clear container
    container.innerHTML = '';
    
    // Create span for each character
    const chars = text.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.setAttribute('aria-hidden', 'true');
      container.appendChild(span);
      return span;
    });
    
    // Add aria-label to container for accessibility
    container.setAttribute('aria-label', text);
    
    return chars;
  }

  static createTypewriterAnimation({
    text,
    container,
    delay = 0,
    charDuration = 0.05,
    staggerDelay = 0.08,
    onComplete
  }: TypewriterConfig): gsap.core.Timeline {
    const chars = this.createCharacterElements(text, container);
    
    const timeline = gsap.timeline({ 
      delay: delay / 1000,
      onComplete
    });
    
    // Animate characters appearing one by one with stagger
    timeline.to(chars, {
      opacity: 1,
      duration: charDuration,
      stagger: staggerDelay,
      ease: "none"
    });
    
    return timeline;
  }

  static clearContainer(container: HTMLElement): void {
    if (container) {
      container.innerHTML = '';
    }
  }

  static killAnimation(timeline: gsap.core.Timeline | null): void {
    if (timeline) {
      timeline.kill();
    }
  }
}