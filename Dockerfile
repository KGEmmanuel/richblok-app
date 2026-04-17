FROM node:20-alpine AS runtime

WORKDIR /app

# Install ONLY the runtime deps declared in package.json. The dist/ build is
# already committed (on master: Angular 9 bundle; on migrate-angular-17:
# Angular 17 bundle) so we skip ng build at image-build time. That's the
# trade-off that keeps Railway builds fast.
#
# --legacy-peer-deps lets us tolerate the legacy AngularFire 5 peer chain on
# master and the overrides-chain on migrate-angular-17.
# --ignore-scripts skips the postinstall `ng build` hook (dist is already baked).
# --omit=dev skips @angular/cli, karma, etc. — pure runtime image.
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts --omit=dev \
    && rm -rf node_modules/@angular/fire/node_modules \
    && npm cache clean --force

# Copy pre-built Angular bundles + Express app entry + server-side libs.
# `lib/` was added with F18 (transcript parser). Anything `server.js` does
# `require('./lib/...')` for must be listed here — Docker's build context
# otherwise leaves it out and the container crashes at module load with
# `Cannot find module './lib/transcript-parser'`.
COPY dist ./dist
COPY dist-server ./dist-server
COPY lib ./lib
COPY server.js ./

EXPOSE 8080

ENV PORT=8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]
