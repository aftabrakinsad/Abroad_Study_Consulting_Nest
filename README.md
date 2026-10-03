<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

  <p align="center">
<table align="center">
  <tr>
  	<th colspan="4"><h3><a href="https://www.aiub.edu">American International University-Bangladesh(AIUB)</a></h3></th>
  </tr>
  
  <tr>
  	<th colspan="4"><h3>Advance Programming in Web Technology</h3></th>
  </tr>
  
  <tr>
  	<th colspan="4">Course Teacher: <a href="https://github.com/Abdullah-Shafi-Sagor">S M ABDULLAH SHAFI</a></th>
  </tr>
  
  <tr>
    <th>Name</th>
    <th>ID</th>
    <th>Section</th>
  </tr>
  
  <tr>
    <td><a href="https://github.com/aftabrakinsad">RAKIN SAD AFTAB</a></td>
    <td>20-41991-1</td>
    <td align="center">C</td>
  </tr>
</table>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
## Running locally

```bash
cp .env.example .env   # fill in your Postgres settings
npm install
npm run start:dev      # http://localhost:3001
```

Students (users) register at `/user/signup`; they're the only accounts that can register. Admins, managers and consultants only sign in (`/admin/signin`, `/manager/signin`, `/consultant/signin`) with accounts created by an admin. The JWT carries the user's role, and each controller only accepts its own role. Only the master admin (`isMaster`) can create, edit or delete admins.

Application workflow: a student submits an application, a manager or admin assigns it to a consultant, and the consultant updates its status and leaves a note the student can see.

On startup the app creates one demo account per role (`DEMO_EMAIL` is the master admin; plus `DEMO_MANAGER_EMAIL`, `DEMO_CONSULTANT_EMAIL`, `DEMO_USER_EMAIL`, all using `DEMO_PASSWORD`) and a sample application. Demo accounts can't be deleted and their passwords can't be changed, so they keep working for visitors.

## Deployment

The API runs on [Render](https://render.com) (see `render.yaml`) with a PostgreSQL database on [Neon](https://neon.tech). The frontend lives in [Abroad_Study_Consulting_Next](https://github.com/aftabrakinsad/Abroad_Study_Consulting_Next).

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (set `DB_SSL=true` for Neon) |
| `FRONTEND_URL` | Allowed CORS origin(s), comma-separated |
| `JWT_SECRET` | Secret used to sign login tokens |
| `DEMO_EMAIL`, `DEMO_MANAGER_EMAIL`, `DEMO_CONSULTANT_EMAIL`, `DEMO_USER_EMAIL`, `DEMO_PASSWORD` | Demo accounts, one per role (`DEMO_EMAIL` is the master admin) |
| `SMTP_*` | Optional. Without `SMTP_HOST`, emails are simulated instead of sent |
