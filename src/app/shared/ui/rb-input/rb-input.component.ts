import { Component, Input, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Richblok V5 text input. Implements ControlValueAccessor so it works
 * with both [(ngModel)] and ReactiveForms.
 *
 *   <rb-input label="Email" type="email" [(ngModel)]="email" />
 *   <rb-input label="Bio" [multiline]="true" [rows]="4" [(ngModel)]="bio" />
 *   <rb-input label="Password" type="password" helper="Min 8 chars" />
 *   <rb-input label="Name" [error]="nameError" />
 */
@Component({
  selector: 'rb-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RbInputComponent),
    multi: true
  }],
  template: `
    <label class="rb-field" [class.rb-field-error]="!!error" [class.rb-field-disabled]="disabled">
      <span class="rb-label" *ngIf="label">
        {{ label }}
        <span *ngIf="required" class="rb-required" aria-hidden="true">*</span>
      </span>

      <textarea *ngIf="multiline; else singleLine"
        [rows]="rows"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [value]="value"
        (input)="onInput($any($event.target).value)"
        (blur)="onTouched()"
        class="rb-input rb-textarea"></textarea>

      <ng-template #singleLine>
        <input
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [value]="value"
          [autocomplete]="autocomplete"
          (input)="onInput($any($event.target).value)"
          (blur)="onTouched()"
          class="rb-input" />
      </ng-template>

      <span *ngIf="helper && !error" class="rb-helper">{{ helper }}</span>
      <span *ngIf="error" class="rb-error">{{ error }}</span>
    </label>
  `,
  styleUrls: ['./rb-input.component.scss']
})
export class RbInputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  @Input() placeholder = '';
  @Input() helper?: string;
  @Input() error?: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() multiline = false;
  @Input() rows = 3;
  @Input() autocomplete = 'off';

  value: string = '';

  private onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(v: string) {
    this.value = v;
    this.onChange(v);
  }

  // ControlValueAccessor
  writeValue(v: any): void { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}
