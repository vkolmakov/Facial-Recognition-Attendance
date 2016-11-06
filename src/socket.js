export const messageTypes = {
  // outgoing
  FRAME: 'FRAME',
  TRAINING: 'TRAINING',
  ADD_PERSON: 'ADD_PERSON',
  ALL_STATE: 'ALL_STATE',
  // incomming
  IDENTITIES: 'IDENTITIES',
}

const ADDRESS = 'ws://localhost:9000'
const socket = new WebSocket(ADDRESS)
socket.binaryType = 'arraybuffer'

socket.onopen = () => socket.send(JSON.stringify({
  type: messageTypes.ALL_STATE,
  images: [],
  people: [],
  training: false
}))

export function getSocket() {
  return socket
}

