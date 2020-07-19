


const io = require('socket.io-client')
//const serverUrl = 'https://protected-peak-88947.herokuapp.com'
const oldUrl = 'http://localhost:3000'
export default function () {
  const socket = io.connect(oldUrl)

  function registerHandler(onMessageReceived) {
    socket.on('message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  function register(name, cb) {
    socket.emit('register', name, cb)
  }

  function join(chatroomName, user,  cb) {
    socket.emit('join', chatroomName, user,  cb)
  }

  function leave(chatroomName, user, cb) {
    socket.emit('leave', chatroomName, user, cb)
  }

  function message(chatroomName, msg, img, cb) {
    socket.emit('message', { chatroomName, message: msg, imgId: img }, cb)
  }


  function setChatroom(payload) {
    socket.emit('chatroom', payload)
  }

  function getChatrooms(payload) {
    socket.emit('chatrooms', null, payload)
  }

  function getAvailableUsers(cb) {
    socket.emit('availableUsers', null, cb)
  }

  return {
    register,
    join,
    leave,
    message,
    setChatroom,
    getChatrooms,
    getAvailableUsers,
    registerHandler,
    unregisterHandler
  }
}