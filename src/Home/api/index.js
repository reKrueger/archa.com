
import axios from 'axios'


const old = 'http://localhost:3000'
//const serverUrl = 'https://protected-peak-88947.herokuapp.com'
const api = axios.create({
    baseURL: old+'/api',
})
export const insertUser = payload => api.post(`/user`, payload)
export const updateUserById = (id, payload) => api.patch(`/user/${id}`, payload)
export const deleteUserById = id => api.delete(`/user/${id}`)
export const getUserById = id => api.get(`/user/${id}`)
export const getUserbyEmailAndPassw = payload => api.put(`/user`, payload)
export const getUserbySearch = payload => api.patch(`/user`, payload)


const apiPic = axios.create({
    baseURL: 'http://localhost:3000/apiimg',
})

export const insertImg = payload => apiPic.post(`/images`, payload)
export const deleteImgById = id => apiPic.delete(`/images/${id}`)
export const getImgById = id => apiPic.get(`/images/${id}`)



const apiChat = axios.create({
    baseURL: 'http://localhost:3000/apichat',
})

export const createChatroom = payload => apiChat.post(`/chatroom`, payload)
export const getChatroomById = id => apiChat.get(`/chatroom/${id}`)
export const updateChatroom = (id,payload) => apiChat.put(`/chatroom/${id}`, payload)
export const deleteChatroomById = (id,payload) => apiChat.delete(`/chatroom/${id}`, payload)

const apis = {
    insertUser,
    updateUserById,
    deleteUserById,
    getUserById,
    insertImg,
    getImgById,
    deleteImgById,
    createChatroom,
    getChatroomById,
    updateChatroom,
    deleteChatroomById,
    getUserbyEmailAndPassw,
    getUserbySearch,
    
}


export default apis