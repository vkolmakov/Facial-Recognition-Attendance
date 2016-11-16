import { Socket, messageTypes } from './socket'

const socket = new Socket({ address: 'ws://localhost:9001' })

export const sendAttendance = (person) => {
  const datetime = new Date()
  return socket.send(JSON.stringify({ person, datetime, type: messageTypes.NEW_ATTENDANCE }))
}

export const error$ = socket.error$
  .map(err => 'A problem occured with attendance logger socket.')
