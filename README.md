# Obv.io - Event Web App

## URLs

This is a single app that handles requests at various subdomains:

app.obv.io (obv.io Service Admin) - Handles billing, creating organizations.

app.obv.io/organization/myorganization (Organization Admin) - Create/manage
events, invite team members, define roles/permisisons

myevent.obv.io - Event site for attendees

or

myevent.staging.obv.io

## Testing

`npm run test` to run tests, or `npm run test:watch` to run tests any time a
file changes.

## Dev

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/develop/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/develop)
[![coverage report](https://gitlab.com/obviobysage/event/web/badges/develop/coverage.svg)](https://gitlab.com/obviobysage/event/web/-/commits/develop)

`npm run dev` to start server at `localhost:3000`

## Staging

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/staging/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/staging)
[![coverage report](https://gitlab.com/obviobysage/event/web/badges/staging/coverage.svg)](https://gitlab.com/obviobysage/event/web/-/commits/staging)

Merge into the `staging` branch to deploy to base url: https://staging.obv.io

## Production

[![pipeline status](https://gitlab.com/obviobysage/event/web/badges/production/pipeline.svg)](https://gitlab.com/obviobysage/event/web/-/commits/production)
[![coverage report](https://gitlab.com/obviobysage/event/web/badges/production/coverage.svg)](https://gitlab.com/obviobysage/event/web/-/commits/production)

Merge into the `production` branch to deploy to prod: https://\*.obv.io
