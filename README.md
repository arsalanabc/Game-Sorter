### Games Sorting App

#### A simple app sort games by favourite team on a given date.

### Required Denpendencies

- [NPM 8 or above](https://www.npmjs.com/package/npm)
- [Node 14 or above](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)

### Before starting

- Node 14 or higher is required
- Server runs on `http://localhost:3000/sort-games`

### Required parameters

- `teamId`: Team id number
- `date`: Date in 'YYYY-MM-DD' format

### Install dependencies

- `npm install`

### Run locally for dev

- Live compiling of Typescript code
  - `npm run build:watch`
- Watches the compiled code for changes and restarts the
  - `npm run watch`

### Testing

- Watch tests for changes and re-run
  - `npm test:watch`
- Run all tests once with coverage
  - `npm test`

### Run in a docker

- Build image with latest tag
  - `make build-image`
- Run the app in a container
  - `make up`

### Assumptions

- A Game is 3 hour long hence if the game has started less than 3 hours ago, it is live.
- One team can have either many single games or one doubleheader (2 either split or single session but not both) on the given date.
- Games are only sorted for a given team id.
