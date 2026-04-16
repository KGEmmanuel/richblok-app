import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Thin wrapper around lucide-angular that standardizes sizing + stroke width
 * across the app. Usage:
 *
 *   <rb-icon name="check" />
 *   <rb-icon name="target" size="lg" accent />
 *
 * The `name` input is any Lucide icon name in kebab-case. The component
 * does NOT tree-shake to individual icons (lucide-angular ships them all
 * together at ~100KB gzip) — if that becomes a bundle concern, we migrate
 * to per-icon imports in a follow-up.
 */
@Component({
  selector: 'rb-icon',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<lucide-icon [name]="name" [size]="pixelSize" [strokeWidth]="stroke" [class.rb-accent]="accent"></lucide-icon>`,
  styles: [`
    :host { display: inline-flex; align-items: center; line-height: 0; }
    lucide-icon { display: inline-flex; }
    .rb-accent { color: var(--rb-accent); }
  `]
})
export class RbIconComponent {
  /** Icon name in kebab-case (e.g. "chevron-right", "check-circle"). */
  @Input({ required: true }) name!: string;

  /** sm = 14, md = 18, lg = 22, xl = 32. Default md. */
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  /** Stroke width; default 2 for body, use 2.5 for CTA emphasis, 1.5 for decorative. */
  @Input() stroke: number = 2;

  /** If true, renders in the accent mint color. */
  @Input() accent: boolean = false;

  get pixelSize(): number {
    switch (this.size) {
      case 'sm': return 14;
      case 'lg': return 22;
      case 'xl': return 32;
      default:   return 18;
    }
  }
}
