import { Socket, messageTypes } from './socket'

const socket = new Socket({ address: 'ws://localhost:9001' })

export const sendAttendance = (person) => {
  const datetime = new Date()
  return socket.send(JSON.stringify({ person, datetime, type: messageTypes.NEW_ATTENDANCE }))
}
