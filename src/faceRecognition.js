import Rx from 'rxjs/Rx'

import { getSocket, messageTypes, socketMessages$ } from './socket'
import { getDataURLFromRGB } from './util'
import { Image, Person, dropAll } from './db'


export const identity$ = socketMessages$
  .filter(message => message.type === messageTypes.IDENTITIES)
  .map(message => {
    const recognizedPersonId =
          message.identities.length > 0
          ? message.identities[0]
          : null

    return recognizedPersonId
  })

export const image$ = socketMessages$
  .filter(message => message.type == messageTypes.NEW_IMAGE)
  .map(message => ({
    image: getDataURLFromRGB(message.content),
    hash: message.hash,
    representation: message.representation,
    identity: message.identity,
  }))
  // save incomming images to db
  .subscribe(image => Image.save(image))

export const state$ = Rx.Observable.fromEvent(getSocket(), 'open')
  .flatMap(_ => getInitialState())
  .map(([images, persons]) => {
    // send the initial state when socket is opened
    sendInitialState(images, persons)
    // and send the state to the front
    return { images, persons }
  })


export const savePerson = ({ name, id }) => {
  const socket = getSocket()

  const msg = {
    type: messageTypes.ADD_PERSON,
    val: name,
  }

  Person.save({ name, id })
  socket.send(JSON.stringify(msg))
}

export const recognize = ({ photo }) => new Promise((resolve, reject) => {
  const socket = getSocket()

  const msg = {
    type: messageTypes.FRAME,
    dataURL: photo,
    identity: null,
  }

  socket.send(JSON.stringify(msg))
})

export const train = ({ id, getPhoto, onStart, onProgress, onComplete }) => {
  const NUM_MESSAGES = 5
  const INTERVAL = 2000

  const socket = getSocket()

  const startMsg = {
    type: messageTypes.TRAINING,
    val: true,
  }

  onStart()
  socket.send(JSON.stringify(startMsg))

  Rx.Observable.interval(INTERVAL)
    .take(NUM_MESSAGES + 1)
    .subscribe({
      next (currentMessage) {
        const msg = {
          type: messageTypes.FRAME,
          dataURL: getPhoto(),
          identity: id,
        }

        // update to n+1 because n is zero-based
        onProgress((currentMessage + 1) / NUM_MESSAGES)

        // the n+1th message is not sent to give some time
        // to process the nth message and turn off the training flag
        if (currentMessage < NUM_MESSAGES)
          socket.send(JSON.stringify(msg))
      },
      complete () {
        const endMsg = {
          type: messageTypes.TRAINING,
          val: false
        }
        socket.send(JSON.stringify(endMsg))
        onComplete()
      }
    })
}

export const dropState = () => {
  return dropAll()
}

export const getInitialState = () => Promise.all([Image.getAll(), Person.getAll()])

export const sendInitialState = (images = [], persons = [], training = false) => {
  const socket = getSocket()

  const msg = {
    type: messageTypes.ALL_STATE,
    images,
    people: persons.map(p => p.id.toString()), // a list of ids, dictated by API
    training,
  }

  socket.send(JSON.stringify(msg))
}
