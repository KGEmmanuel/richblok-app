import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Richblok V5 chip — small pill for statuses, tags, competencies, counts.
 *
 *   <rb-chip variant="verified">✓ Verified</rb-chip>
 *   <rb-chip variant="draft">● Draft</rb-chip>
 *   <rb-chip variant="tag">Leadership</rb-chip>
 *   <rb-chip variant="accent">Top 27%</rb-chip>
 */
@Component({
  selector: 'rb-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'rb-chip rb-chip-' + variant"><ng-content></ng-content></span>`,
  styleUrls: ['./rb-chip.component.scss']
})
export class RbChipComponent {
  @Input() variant: 'verified' | 'draft' | 'tag' | 'accent' | 'danger' | 'neutral' = 'neutral';
}
