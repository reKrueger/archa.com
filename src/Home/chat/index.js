import React from 'react'
import socket from './../socket/socket'
import './index.css'
import Chatverlauf from './chatVerlauf'
import Chatroom from './chatroom'
import DbController from './../mongoController'
import ChatImg from './chatImage'
import { GoX } from "react-icons/go";
import Avatar from './../avatar'




export class Chatbox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            newChat:false,
            chatboxOpen: false,
            user: this.props.user,
            chatUser: null,
            chatUserId: null,
            chatUserName: null,
            chatUserImgUrl: null, 
            isRegisterInProcess: false,
            login: true,
            date: new Date(),
            chatHistory:[],
            chatroom: null,
            chatroomId: null,
            chatroomName: null,
            input: '',
            img: null,
            imgUrl: null,
            imgId: null,
            setup: false,
            connect: false,
            online: '',
            useDB: DbController(),
            client: socket()

        }
        this.onMessageReceived = this.onMessageReceived.bind(this)
        this.onSendMessage = this.onSendMessage.bind(this)
        this.onEnterChatroom = this.onEnterChatroom.bind(this)
        this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
        this.updateChatHistory = this.updateChatHistory.bind(this)
        
                         
    }

    



    componentDidUpdate(prevProps, prevState){
        if(this.props.openChat!==prevProps.openChat){
            this.setState({
                contactId: this.props.openChatNachrichten.contactId,
                contactName: this.props.openChatNachrichten.contactName,
                contactPic: this.props.openChatNachrichten.contactPic,
                chatroomName: this.props.openChatNachrichten.chatroomName,
                chatroomId: this.props.openChatNachrichten.chatroomId
            })
        }  
        if(this.props.user.contacts!==prevProps.user.contacts){
            console.log('chat index')
            console.log(this.props.user)
            this.setState({user:this.props.user})
        }
    }

    

    openChat=(e)=>{
        this.setState({
            chatUserId: e.chatUserId,
            chatUserName: e.chatUser,
            chatUserImgUrl: e.chatUserImgUrl,
        }, ()=>this.checkChatroom())
    }

     //_____1._______   ist Chatroom vorhanden?????
    checkChatroom = ()=>{
        if(this.state.user.chatrooms.contactId.length===0){
            console.log('kein chatroom.... gefunden')
            this.createChatroomDb()
            return
        }
        const n = this.state.user.chatrooms.contactId 
        const contactId = this.state.chatUserId
        if(n.find(e=> e===contactId)){
            this.loadChathistory()
            return
        }else{
            console.log('neuer chatroom erstellen')
            this.createChatroomDb()
            return
        }
    }
    
    // erstellt die Datenbank für neuen Chatroom!!!!!!
    createChatroomDb = async()=>{
        const userId = this.state.user._id
        const chatUserId = this.state.chatUserId
        const name = userId+'@'+chatUserId
        const users = [{userId: userId},{userId: chatUserId}]
        const payload = {name, users}
        const chatroom = await this.state.useDB.createChatroom(payload)
        if(chatroom){
            this.updateChatroomForUsers(chatroom, chatroom._id, name, userId, chatUserId)
            this.updateChatroomForUsers(chatroom, chatroom._id, name, chatUserId, userId)
        }
    }
    //chatroom erstellt ===> update UserDB
    updateChatroomForUsers = async(chatroom, id, name , userId , contactId)=>{
        const userDb = await this.state.useDB.getUser(userId)
        if(userDb){
            const chatrooms = userDb.chatrooms
            chatrooms.id.push(id)
            chatrooms.name.push(name)
            chatrooms.contactId.push(contactId)
        }
        const {chatrooms} = userDb
        const payload = {chatrooms} 
        const update = await this.state.useDB.updateUser(userId, payload)
        if(update){
            if(userId===this.state.user._id){
                this.setState({
                    user: update,
                    chatroomId: id,
                    chatroom: chatroom,
                    chatroomName: chatroom.name
                }, ()=>this.setName())
            }
            console.log('update: chatroom erstellt.....')
        }
    }


    // lade chathistory
    loadChathistory =  async () => {
        const n = this.state.user.chatrooms.contactId 
        const contactId = this.state.chatUserId
        const index = n.findIndex(e=>e===contactId)
        const cRoom = await this.state.useDB.getChatroomById(this.state.user.chatrooms.id[index])
        if(cRoom){
            this.setState({
                chatroomId: cRoom._id,
                chatroom: cRoom,
                chatroomName: cRoom.name, 
                chatHistory:cRoom.chat,
            }, ()=> this.setName())
        }
    }

    
    
    // erstellt user im Socket........
    setName = () => {
        const obj = {userId: this.state.user._id}
            // user eintrag verbesssern
        this.register(obj)
        this.getRoom()
    }
    register(name) {
        const onRegisterResponse = user => this.setState({ isRegisterInProcess: false, online: user, })
        this.setState({ isRegisterInProcess: true })
        this.state.client.register(name, (err, user) => {
          if (err) return onRegisterResponse(null)
          return onRegisterResponse(user)
        })
    }
    // erstellt chatroom für Socket......
    setRoom = () =>{
        this.state.client.setChatroom(this.state.chatroom)
        this.onEnterChatroom(this.state.chatroomName)
    }
    // sucht nach chatroom im Socket......
    getRoom = () =>{
        this.state.client.getChatrooms((err, res) => {
            if(err){
                console.log(err)
            }
            for(let i in res){
                if(res[i].name===this.state.chatroomName){
                    return this.onEnterChatroom(this.state.chatroomName)
                }
            }
            this.setRoom()
            this.setState({connect: true})
          })
    }
            
    onEnterChatroom(chatroomName){
        const user = this.state.user._id
        return this.state.client.join(chatroomName, user,  (err, chatHistory) => {
            if (err){
                return console.error(err)
            }
            return this.setState({
                connect:true
                }, ()=>this.state.client.registerHandler(this.onMessageReceived))
        })
    }
    

    // schließe -Dialog -message -chatroom
    close = () =>{
        const user = this.state.user._id
        this.state.client.unregisterHandler()
        this.state.client.leave(this.state.chatroomName, user, (err, chatHistory) => {
            if (err){
              return console.error(err)
            }
        })
        this.setState({
            connect: false,
            chatHistory:[],
            chatroom: null,
            chatroomId: null,
            chatroomName: null,
            input: '',
            img: null,
            imgUrl: null,
            imgId: null,
            setup: false,
            chatUser: null,
            chatUserId: null,
            chatUserName: null,
            chatUserImgUrl: null, 
            newChat:false,
            chatboxOpen: false,

        })
    } 

    // chatroom verlassen
    onLeaveChatroom(chatroomName, onLeaveSuccess) {
        this.state.client.leave(chatroomName, (err) => {
          if (err){
            return console.error(err)
          }
          return onLeaveSuccess()
        })
    }
    
    // input user => eingabefelder setten......
    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value });
    }  
    // sende message    =>
    onSendMessage = () =>{ 
        if(this.state.img===null){
            if(this.state.input===''){
                return
            }
            const message = this.state.input
            const cb = (err) => {
                if (err){
                    return console.error(err)
                }
            } 
            const croom = this.state.chatroomName
            this.state.client.message(croom, message, cb)
        }else{
            const imgId = this.state.imgId
            const message = this.state.input
            const cb = (err) => {
                if (err){
                    return console.error(err)
                }
            } 
            const croom = this.state.chatroomName
            this.state.client.message(croom, message, imgId, cb)
        }
        
    }

    //       =============>     chatverlauf
    onMessageReceived(entry) {
        console.log('onMessageReceived:', entry)
        this.updateChatHistory(entry)
    }

    updateChatHistory(entry) {
        if(!entry.message && !entry.imgId){
            return
        }
        if(entry.imgId){
            this.setState({ chatHistory: this.state.chatHistory.concat(entry), input:' '},()=>this.saveMessage())
            return
        }
        this.setState({ chatHistory: this.state.chatHistory.concat(entry), input:''},()=>this.saveMessage())
      }
    

    
    saveMessage = async()=>{
        const chat = this.state.chatHistory
        const id = this.state.chatroomId
        const payload = {chat}
        this.state.useDB.updateChatroom(id,payload)

        
    }
    


    scrollChatToBottom() {
        this.panel.scrollTo(0, this.panel.scrollHeight)
    }
    



    useImg = async (e,txt)=>{ 
        const picName = this.state.userName
        let file = await fetch(e)
        .then(r => r.blob())
        .then(blobFile => new File([blobFile], picName, {type: "image/png" }))
        const id = await this.state.useDB.imgSave(file)
        if(id){
            this.setState({
                img:file,
                imgUrl:e,
                imgId:id,
                input: txt,
            },()=>this.onSendMessage())
        }
        
    }

    render(){
        if(this.state.connect){ 
            return(
                <div className='ChatverlaufCon'>
                    <div className='chathead'>
                        <div className='chatHeadImgDiv'><Avatar name={this.state.chatUserName} imgUrl={this.state.chatUserImgUrl}/></div>
                        <div className='chatheadName'>{this.state.chatUserName}</div>
                        <ChatImg img={this.useImg}/>
                        <button className='chatheadBtn' onClick={()=>this.close()}><GoX size={16}/></button>
                    </div>
                    <div className='chatContainer'>
                        <Chatverlauf 
                            chatHistory={this.state.chatHistory} 
                            closeMess={this.close} 
                            user={this.state.user} 
                            contactName={this.state.chatUserName} 
                            contactPic={this.state.chatUserImgUrl} 
                            contactId={this.state.chatUserId}
                            />
                        <div className='chatEingabe'>
                            <textarea className="chatInput" placeholder='deine Nachricht...' name="input" value={this.state.input}  onChange={this.handleChange} ></textarea>
                            <button className="chatBtn" onClick={()=>this.onSendMessage()}>senden</button>
                        </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div className='chatroomFrame'>
                    <Chatroom user={this.props.user} openChat={this.openChat}/>
                </div>
            )
        }
    }  
}       
        
    


export default Chatbox;



  