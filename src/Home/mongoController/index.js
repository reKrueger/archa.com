
import api from './../api/index'

export default function () {


  // Speichere Bild
  async function imgSave(imgBlob) {
    const data = new FormData();
        var imagedata = imgBlob;
        if(imagedata==null){
           window.alert('du musst ein Profilbild wählen')
           return
        }
        data.append("profilpic",imagedata);
    const e = await api.insertImg(data).then(res=> {
        const imgId = res.data
        return imgId
    })
    return e
  }


  // lade Bild.....
  async function getImg(id){
    const e = await api.getImgById(id).then(res=>{
      const imgUrl = res.config.baseURL+res.config.url
      return  imgUrl
    })
    return e
  }


  // Speichere neuen USer
  async function newUserSave(payload) {
    const e = await api.insertUser(payload).then(res => {
      const userDb = res.data.userDb
      return userDb
    })
    return e
  }

  // suche user nach id
  async function getUser(id){
    const e = await api.getUserById (id).then(res=>{
      if(res.data.success){
        const user = res.data.data
        return user
      }else{
        return false
      }
      
    })
    return e
  }


  // suche user nach Email und password
  async function getUserbyEAndP(payload){
    const e = await api.getUserbyEmailAndPassw(payload).then(res=>{
      if(res.data.success){
        const user = res.data.data
        return user
      }else{
        return false
      }
      
    })
    return e
  }

  

  // suche .....
  async function getSearch(search){
    const e = await api.getUserbySearch(search).then(res=>{
      if(res.data.success){
        const user = res.data.data
        return user
      }else{
        return false
      }
      
    })
    return e
  }

   // update User....
   async function updateUser(id,payload){
    const e = await api.updateUserById(id, payload).then(res=>{
      if(res.data.success){
        const user = res.data.data
        return user
      }else{
        return false
      }
      
    })
    return e
  }

  // erstelle Chatroom
  async function createChatroom(payload) {
    const chatroom = await api.createChatroom(payload).then(res => {
      const chatroomData = res.data.data
      return chatroomData
    })
    return chatroom
  }





  // lade Chatrooms
  async function getChatroomById(id) {
    const e = await api.getChatroomById(id).then(res => {
      const chatroom = res.data.data
      return chatroom
    })
    return e
  }

   // update Chatroom....
   async function updateChatroom(id,payload){
    const e = await api.updateChatroom(id, payload).then(res=>{
      if(res.data.success){
        const cId = res.data.id
        return cId
      }else{
        return false
      }
      
    })
    return e
  }
 










  return {
    imgSave,
    newUserSave,
    getUser,
    getUserbyEAndP,
    getImg,
    getSearch,
    updateUser,
    createChatroom,
    getChatroomById,
    updateChatroom
    

  }
}