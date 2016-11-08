import { getSocket, messageTypes } from './socket'
import Rx from 'rxjs/Rx'

export const identity$ = Rx.Observable.fromEvent(getSocket(), 'message')
  .map(event => JSON.parse(event.data))
  .filter(message => message.type === messageTypes.IDENTITIES)
  .map(message => {
    const recognizedPersonId =
          message.identities.length > 0
          ? message.identities[0]
          : null

    return recognizedPersonId
  })

export const addPerson = ({ name }) => {
  const socket = getSocket()

  const msg = {
    type: messageTypes.ADD_PERSON,
    val: name,
  }

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

        // update to n + 1 because n is zero-based
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
