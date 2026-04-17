import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Richblok V5 stat display — big numeric with a caption label.
 * Uses JetBrains Mono with tabular-nums for clean column alignment.
 *
 *   <rb-stat [value]="12" label="Challenges" />
 *   <rb-stat value="87/100" label="Top score" accent />
 *   <rb-stat value="Top 27%" label="Africa percentile" size="lg" />
 */
@Component({
  selector: 'rb-stat',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rb-stat" [class.rb-stat-lg]="size === 'lg'" [class.rb-stat-accent]="accent">
      <div class="rb-stat-value">{{ value }}</div>
      <div class="rb-stat-label">{{ label }}</div>
    </div>
  `,
  styleUrls: ['./rb-stat.component.scss']
})
export class RbStatComponent {
  @Input({ required: true }) value!: string | number;
  @Input({ required: true }) label!: string;
  @Input() size: 'md' | 'lg' = 'md';
  @Input() accent = false;
}
