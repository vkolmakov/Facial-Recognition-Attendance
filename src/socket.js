import Rx from 'rxjs/Rx'

export const messageTypes = {
  // outgoing
  FRAME: 'FRAME',
  TRAINING: 'TRAINING',
  ADD_PERSON: 'ADD_PERSON',
  ALL_STATE: 'ALL_STATE',
  // incomming
  IDENTITIES: 'IDENTITIES',
  NEW_IMAGE: 'NEW_IMAGE',
}

const ADDRESS = 'ws://localhost:9000'
const socket = new WebSocket(ADDRESS)
socket.binaryType = 'arraybuffer'

export function getSocket() {
  return socket
}

export const socketMessages$ = Rx.Observable.fromEvent(getSocket(), 'message')
  .map(event => JSON.parse(event.data))
