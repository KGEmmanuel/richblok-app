import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RbIconComponent } from '../rb-icon/rb-icon.component';

/**
 * Richblok V5 empty state — icon + heading + sub + optional CTA slot.
 *
 *   <rb-empty-state
 *     icon="target"
 *     heading="No challenges yet"
 *     sub="Complete your first challenge to generate a STAR story.">
 *     <rb-button>Start free challenge</rb-button>
 *   </rb-empty-state>
 */
@Component({
  selector: 'rb-empty-state',
  standalone: true,
  imports: [CommonModule, RbIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rb-empty">
      <div class="rb-empty-icon" *ngIf="icon">
        <rb-icon [name]="icon" size="xl" [stroke]="1.5" />
      </div>
      <h3 class="rb-empty-heading" *ngIf="heading">{{ heading }}</h3>
      <p class="rb-empty-sub" *ngIf="sub">{{ sub }}</p>
      <div class="rb-empty-cta">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./rb-empty-state.component.scss']
})
export class RbEmptyStateComponent {
  @Input() icon?: string;
  @Input() heading?: string;
  @Input() sub?: string;
}
