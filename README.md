<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[![Build Status](https://dev.azure.com/enoviah/Enoviah/_apis/build/status/S-mhealth?branchName=master)](https://dev.azure.com/enoviah/Enoviah/_build/latest?definitionId=61&branchName=master)

## Description

Javascript api for epitech REACT module.

## Requirements

* Local run
    * NodeJs >= 10.19.0
    * NPM >= 6.14.4
* Docker
    * Docker >= 2.10.1
    * Docker-compose 1.27.4

## Docker

### Configuration

First step is to open _docker-compose.yml_
Take a look at the _environments variables_. You can edit them as much as you want.

If you want to edit mongo variables, don't forget to apply them to api container.

### Spotify

If you want to enable spotify's features, you must follow these steps:

* Go [Spotify](https://developer.spotify.com/dashboard/applications)
* Register a new application **Warning** don't forget to set your redirect uri
  to _http://localhost:8080/spotify/callback_
* Copy & paste your spotify **Client ID** and **Client Secret** into the docker-compose file

```yaml
SPOTIFY_CLIENT_SECRET: YOUR_SPOTIFY_SECRET
SPOTIFY_CLIENT_ID: YOUR_SPOTIFY_PUBLIC
SPOTIFY_REDIRECT_URI: http://localhost:8080/spotify/callback
```

### Run

use

```bash 
$ docker-compose up -d
```

to create MongoDb and api containers.

### Usage

Api HTTP url is http://localhost:8080/
A fully described documentation is available at http://localhost:8080/api-docs

Api Websocket url is http://localhost:8081/sync
After first call, you can switch to wss.

## Local

You can run this api locally. By using this method, you will be able to edit code and see modifications in live mode.

### Environment

First step is to create the _.env_ file. This api is using **dotenv** file to supply configuration variables. You can
take a look at _.env.example_ to see all variables.

```dotenv
#Port of the api
PORT=8080
URL=http://localhost:8080

#Mongo database to use
MONGO_DATABASE=myDb
MONGO_ADDRESS=mongodb:27017
MONGO_USER= default
MONGO_PASSWORD= default
#Oauth2 credentials
OAUTH2_API=https://auth-staging.outworld.fr
CLIENT_ID=SBT8kP2nRuBPucg8
CLIENT_SECRET=YNoNU7vMTwnDqoPHhV90QxL5Vxw306FS

# Spotify credentials

SPOTIFY_CLIENT_SECRET=xxxxxx
SPOTIFY_CLIENT_ID=xxxxx
SPOTIFY_REDIRECT_URI=http://localhost:8080/spotify/callback
```

### Dependencies

To install all dependencies, run

```bash
$ npm i
```

### Build & Run

You have 2 ways to run the api.

**Single run**
Api will be build and start.

```bash
$ npm run start
```

**Run with file watcher**

Api will be build & run. If any source file is modified, api will be re-build and re-run

```bash
$ npm run start:dev
```

## Development

### Linter

This api use the airbnb eslint linter. Use

```bash
$ npm run lint
```

to run it.

## Sockets

This api allow you to connect via socket to get real time update.

### Init your library

for this example, we will use socket.io format. But you can take any websocket client.

```typescript
var socket = import('socket.io-client')('http://localhost:8081/sync');

// Default event when connection is ready

socket.on('connect', function() {
});

// Custom event to tell the api that the client is ready to start communication
// Remember user should be connect to auth-staging.outworld.fr & spotify.com
socket.emit('preconnect', { userId: 'xxxxxx' }, (error: { code: string; error: string; }) => {
  // On success error is empty. On error, error is equal to {code: string, error: string}
});


socket.on('disconnect', function() {
});

```

**WARNING** next steps need to be called after _preconnect_ event.

### Listen to player state

You can watch any changer from your spotify player by subscribing to _player-state_ event.

```typescript
interface PlayerState {
  isActive: boolean;
  isPlaying: boolean;
  playing: 'track' | 'playlist';
  item: SpotifyTrack;
}

socket.on('player-state', (playerState: PlayerState) => {
});
```

### Chat with other users

You can start a conversation with other users. Each conversation will be handled by a room.

```typescript
// ids is an array of string representing other users to add in the conversation
socket.emit('new-room', { ids: ['xxxxxx'] }, (response: { messages: string, id: number }) => {
  // On success each user of the room will receive the new-room event
});
```
