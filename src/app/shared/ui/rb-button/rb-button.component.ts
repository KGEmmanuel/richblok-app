import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Richblok V5 canonical button. Usage:
 *
 *   <rb-button>Save changes</rb-button>
 *   <rb-button variant="ghost" size="sm">Cancel</rb-button>
 *   <rb-button variant="link" [disabled]="true">Deleting…</rb-button>
 *   <rb-button variant="danger" [loading]="saving" (clicked)="onDelete()">Delete</rb-button>
 *
 * Replaces every `btn btn-primary`, `btn btn-outline-*`, `btn-sm` etc.
 * usage across the legacy Bootstrap pages.
 */
@Component({
  selector: 'rb-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [class]="'rb-btn rb-btn-' + variant + ' rb-btn-' + size"
      [class.rb-btn-loading]="loading"
      [class.rb-btn-full]="full"
      [disabled]="disabled || loading"
      (click)="clicked.emit($event)">
      <span class="rb-btn-inner" [class.rb-btn-hidden]="loading">
        <ng-content></ng-content>
      </span>
      <span *ngIf="loading" class="rb-btn-spinner" aria-label="Loading"></span>
    </button>
  `,
  styleUrls: ['./rb-button.component.scss']
})
export class RbButtonComponent {
  @Input() variant: 'primary' | 'ghost' | 'link' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() full = false;
  @Output() clicked = new EventEmitter<MouseEvent>();
}
