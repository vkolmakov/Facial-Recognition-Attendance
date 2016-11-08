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

class Socket {
  constructor({ address }) {
    this.address = address
    this.socket = new WebSocket(address)
    this.socket.binaryType = 'arraybuffer'
  }

  address() {
    return this.address
  }

  send (msg) {
    return Promise.resolve(this.socket.send(msg))
  }

  close () {
    return Promise.resolve(this.socket.close())
  }

  getSource () {
    return this.socket
  }

  socketMessages$ () {
    return Rx.Observable.fromEvent(this.getSource(), 'message')
      .map(event => JSON.parse(event.data))
  }

  socketOpen$ (){
    return Rx.Observable.fromEvent(this.getSource(), 'open')
  }
}

export const socket = new Socket({ address: 'ws://localhost:9000' })
