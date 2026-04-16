/***************************************************************************************************
 * Server bootstrap — compiled to dist-server/main.js by `ng run Rib:server`.
 * Imported by server.ts to render Angular pages on demand.
 */
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
