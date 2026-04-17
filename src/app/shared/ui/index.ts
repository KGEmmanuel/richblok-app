/**
 * Richblok V5 UI kit — the canonical design system.
 * Import via: import { RbButtonComponent, RbCardComponent, ... } from 'src/app/shared/ui';
 *
 * Every component is standalone (Angular 17) and can be imported
 * individually into another standalone component's `imports:` array.
 */

export { RbIconComponent }        from './rb-icon/rb-icon.component';
export { RbButtonComponent }      from './rb-button/rb-button.component';
export { RbInputComponent }       from './rb-input/rb-input.component';
export {
  RbCardComponent,
  RbCardTitleComponent,
  RbEyebrowComponent,
}                                 from './rb-card/rb-card.component';
export { RbChipComponent }        from './rb-chip/rb-chip.component';
export { RbStatComponent }        from './rb-stat/rb-stat.component';
export { RbEmptyStateComponent }  from './rb-empty-state/rb-empty-state.component';

// Shells — wrap page content with the V5 chrome (nav + logo + main container).
// rb-app-shell for authenticated pages; rb-public-shell for marketing/auth.
export { RbAppShellComponent }    from './rb-app-shell/rb-app-shell.component';
export { RbPublicShellComponent } from './rb-public-shell/rb-public-shell.component';
