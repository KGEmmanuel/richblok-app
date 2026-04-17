import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Richblok V5 canonical card. Container for content with consistent
 * surface, border, padding, radius.
 *
 *   <rb-card>
 *     <rb-card-title>Your Richblok this week</rb-card-title>
 *     <div>…content…</div>
 *   </rb-card>
 *
 *   <rb-card interactive [routerLink]="['/badge', id]">
 *     Clickable card
 *   </rb-card>
 *
 * Replaces every `class="box shadow-sm border rounded bg-white osahan-*"`
 * usage across the legacy Bootstrap pages.
 */
@Component({
  selector: 'rb-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./rb-card.component.scss'],
  host: {
    '[class.rb-card]': 'true',
    '[class.rb-card-interactive]': 'interactive',
    '[class.rb-card-flush]': 'flush',
    '[class.rb-card-raised]': 'raised',
    '[attr.tabindex]': 'interactive ? 0 : null'
  }
})
export class RbCardComponent {
  /** When true, adds hover/focus ring + pointer cursor. Use for clickable cards. */
  @Input() interactive = false;

  /** When true, removes internal padding. Use when content does its own padding. */
  @Input() flush = false;

  /** When true, uses the elevated surface color + subtle shadow. */
  @Input() raised = false;
}

/** Small title partner component — put at top of a card. */
@Component({
  selector: 'rb-card-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h2 class="rb-card-title"><ng-content></ng-content></h2>`,
  styleUrls: ['./rb-card.component.scss']
})
export class RbCardTitleComponent {}

/** Small eyebrow partner — uppercase mono kicker above a title. */
@Component({
  selector: 'rb-eyebrow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="rb-eyebrow"><ng-content></ng-content></span>`,
  styleUrls: ['./rb-card.component.scss']
})
export class RbEyebrowComponent {}
