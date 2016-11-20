# Facial Recognition Attendance

## Running

This project currently depends on [openface](https://github.com/cmusatyalab/openface) and uses its websocket server from web demo. Make sure to have [Docker](https://www.docker.com/) installed and build the openface image.

```bash
# install dependencies
npm install

# start the websocket server, will listen at localhost:9000
npm run start-server

# serve with hot reload at localhost:8080
npm run dev
```

## Quick Demo

![demo](/screenshots/demo.gif)

## Built with

* [Vue.js](https://vuejs.org/)
* [RxJS](http://reactivex.io/rxjs/)
* [PouchDB](https://pouchdb.com/)
