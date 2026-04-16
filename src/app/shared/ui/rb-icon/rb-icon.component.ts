import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Thin wrapper around lucide-angular that standardizes sizing + stroke width
 * across the app. Usage:
 *
 *   <rb-icon name="check" />
 *   <rb-icon name="target" size="lg" accent />
 *
 * Icons are registered globally in AppModule via
 * `LucideAngularModule.pick({...})` — see src/app/app.module.ts. If a template
 * references an icon not registered there, Angular logs at runtime:
 *   `"<name>" icon has not been provided by any available icon providers.`
 * Add the missing icon to the AppModule pick() list and rebuild.
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

  /** Stroke width; default 2 for body, 2.5 for CTA emphasis, 1.5 for decorative. */
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
