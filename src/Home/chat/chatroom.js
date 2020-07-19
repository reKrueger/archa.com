import React from 'react'
import './chatroom.css'
import { MdSearch, MdChat } from "react-icons/md";
import DbController from './../mongoController'
import DialogCheck from './../dialogCheck'
import Avatar from './../avatar'


function ListItem(props) {
    return (<div>
                <div className= "chatValue">{props.value}</div>
            </div>);
}

export class Chatroom extends React.Component{
    constructor(props){
        super(props);
        this.state={
                date: new Date(),
                user: this.props.user,
                chatrooms: this.props.user.chatrooms,
                loading: true,
                openChat: null,                    
                chat:false,
                search:'',
                searchFound:false,
                useDB: DbController(),
                chatUser: null,
                chatUserImgUrl: null,
                chatUserArr:null,
                chatUserImgUrlArr:null,
                chatUserIdArr:null,
                dialogCheck:false,
                avatar:null
        }
    }

    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }
    handleSearch = ({ target }) => {
        this.setState({ [target.name]: target.value, searchFound:false  },()=>this.searchChatUser())
    }

                
    componentDidUpdate(prevProps){
        if(this.props.user.chatrooms!==prevProps.user.chatrooms){
            
        }
        if(this.props.user.contacts!==prevProps.user.contacts){
            this.setState({user: this.props.user}, ()=>this.loadChatUser())
            
        }
    }
    componentDidMount(){
        if(this.state.user.contacts.length>0){
            this.loadChatUser()
        }
        
    }
   
    

    runopenChatbox = (e) => {
        const payload = {
            chatUser: this.state.chatUserArr[e],
            chatUserImgUrl: this.state.chatUserImgUrlArr[e],
            chatUserId: this.state.chatUserIdArr[e],
            user: this.state.user,
        }
        this.props.openChat(payload)
        
    }


    // + Update
    callbackUpdate = (e) =>{
        this.props.update(e)
    }

    loadChatUser = async()=>{
        const chatUser = this.state.user.contacts
        const imgIdArr = [] // img Id from chatuser
        const userNameArr = [] // name from chatuser
        const userIdArr = [] //  Id from chatuser
        
        const userArr = await Promise.all(chatUser.map(async(e) => await this.state.useDB.getUser(e)))
        if(userArr){
            for(let i of userArr){
                if(i.imgId){
                    imgIdArr.push(i.imgId)
                }else{
                    imgIdArr.push(null)
                }
            
                userIdArr.push(i._id)
                userNameArr.push(i.userName)
            }
            const imgUrlArr = await Promise.all(imgIdArr.map(async(e) => await this.state.useDB.getImg(e)))
            if(imgUrlArr){
                this.setState({
                    chatUserArr: userNameArr,
                    chatUserImgUrlArr: imgUrlArr,
                    chatUserIdArr: userIdArr
                })
            }
        }
    }
    
   

    searchChatUser = async()=>{
        if(this.state.search===''){
            return
        }
        const {search} = this.state
        const payload = {search}
        const user = await this.state.useDB.getSearch(payload)
        if(user){
            if(!user.imgId){
                this.setState({chatUser:user, searchFound:true, chatUserImgUrl:null })
            }
            const imgUrl = await this.state.useDB.getImg(user.imgId)
            if(imgUrl){
                this.setState({chatUser: user, chatUserImgUrl:imgUrl, searchFound:true})
            }
        }
    }

    updateContactUser = async()=>{
        const id = this.state.user._id
        const chatUserId = this.state.chatUser._id
        if(id===chatUserId){
            return
        }
        const contacts = this.state.user.contacts
        if(contacts.find(e=> e===chatUserId)){
            return
        }
        let payload
        if(!contacts){
            payload = {contacts:[chatUserId]}
        }else{
            contacts.push(chatUserId)
            payload = {contacts}
        }
        this.invitation(chatUserId)
        const userUpdate = await this.state.useDB.updateUser(id,payload)
        if(userUpdate){
            this.setState({user: userUpdate},()=>this.loadChatUser())
        }
        
    }

    invitation = async(id)=>{
        const userId = this.state.user._id
        const chatUser = await this.state.useDB.getUser(id)
        if(chatUser){
            const invitations = chatUser.invitations
            if(invitations.find(e=> e===userId)){
                return
            }else{
                invitations.push(userId)
                const payload = {invitations}
                const chatUserInvitation = await this.state.useDB.updateUser(id,payload)
                if(chatUserInvitation){
                    window.alert('anfrage gesendet')
                }
            }
        }
        
    }



    search = ()=>{
        return(
            <div className='searchFrame'>
                <div className='searchDiv'>
                    <div className='searchInputDiv'>
                        <input className='searchInput' type='text' name='search' placeholder='Suche' value={this.state.search} onChange={this.handleSearch}></input>
                        <button className='searchIconBtn' onClick={()=>this.searchChatUser()}><MdSearch size={30}/></button>
                    </div>
                    {this.addChatUser()}
                </div>
            </div>
        )
    }


    addChatUser = ()=>{
        if(this.state.searchFound){
            return(
                <div className='searchFoundFrame'>
                    <button className='searchUserBtn' onClick={()=>this.setState({dialogCheck:true})}>
                        <div className='searchUserImgDiv'>
                            <Avatar name={this.state.chatUser.userName} imgUrl={this.state.chatUserImgUrl}/>
                        </div>
                        <div className='searchUserNameDiv'>{this.state.chatUser.userName}</div>
                        <div className='searchUserIcon'><MdChat size={36}/></div>
                    </button>
                    <DialogCheck 
                        text={<div>möchtest du <div style={{fontWeight: "bold"}}>{this.state.chatUser.userName}</div> zu dein kontakten hinzufügen ?</div>}
                        open={this.state.dialogCheck}
                        checked={this.dialogCallback}
                    />

                </div>
            )
        }else{
            return null
        }
    }

    dialogCallback = (e)=>{
        if(e){
            this.setState({search:'', dialogCheck:false, searchFound: false},()=>this.updateContactUser())
        }else{
            this.setState({search:'', dialogCheck:false, searchFound: false})
        }
    }


    chatrooms = ()=> {
        const lines = [];
        for(let i in this.state.chatUserIdArr){
            const name = this.state.chatUserArr[i]
            const pic = this.state.chatUserImgUrlArr[i]
                lines.push(
                    <div className='chatroominListe'>
                    <button className='btnchatroomuser' onClick={()=>this.runopenChatbox(i)}>
                        <div className='chatroomuser'>
                            <div className='chatroomuserDiv'>
                                <div className="chatroomImgDiv">
                                    <Avatar name={name} imgUrl={pic}/>
                                </div>
                                <div className='chatroomTxtDiv'>
                                    <div className='chatroomProfilName'>{name}</div>
                                </div>
                            </div>
                            
                        </div>
                        </button>
                   </div>
                )
        }
        const listItems = lines.map((room) =>
        <ListItem value={room} key={lines.indexOf(room) } />);
        return listItems;
    }

   
    
    render(){
        return(
            <div className='chatroomDiv'>
                <div className='chatListRooms'>
                    {this.search()}
                    <div className='chatroomListeFrame'>
                        {this.chatrooms()}
                    </div>
                </div>
            </div>    
        )
    }
    
}

export default Chatroom   
