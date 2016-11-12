import Rx from 'rxjs/Rx'

export const messageTypes = {
  // outgoing
  FRAME: 'FRAME',
  TRAINING: 'TRAINING',
  ADD_PERSON: 'ADD_PERSON',
  ALL_STATE: 'ALL_STATE',
  NEW_ATTENDANCE: 'NEW_ATTENDANCE',
  // incomming
  IDENTITIES: 'IDENTITIES',
  NEW_IMAGE: 'NEW_IMAGE',
}

export class Socket {
  constructor({ address }) {
    this.address = address
    this.socket = new WebSocket(address)
    this.socket.binaryType = 'arraybuffer'
  }

  send (msg) {
    return Promise.resolve(this.socket.send(msg))
  }

  close () {
    return Promise.resolve(this.socket.close())
  }

  get _source () {
    return this.socket
  }

  get socketMessages$ () {
    return Rx.Observable.fromEvent(this._source, 'message')
      .map(event => JSON.parse(event.data))
  }

  get socketOpen$ () {
    return Rx.Observable.fromEvent(this._source, 'open')
  }
}
