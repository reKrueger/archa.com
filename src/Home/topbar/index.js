import React from 'react';
import './index.css';
import DbController from './../mongoController'
import { MdMenu } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import DialogCheck from './../dialogCheck'
import Menu from './../dialogMenu'
import Avatar from './../avatar'


function ListItem(props) {
    return (<div>
                <div className= "invitationValue">{props.value}</div>
            </div>);
}

export class Topbar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user: this.props.user,
            imgUrl: null,
            build:false,
            useDB: DbController(),
            invitation: this.props.invitation,
            invitUserName:[],
            invitUserImgUrl:[],
            dialogCheck:false,
            inviIndex: null,
            dropdown: false,

        }
        this.userData = this.userData.bind(this)
    }


    
    componentDidUpdate(prevProps){
       if(this.props.user!==prevProps.user){
           this.setState({user:this.props.user},()=>this.getImg())
       }
       if(this.props.invitation!==prevProps.invitation){
        this.setState({invitation:this.props.invitation}, ()=>this.loadInvitationUser())
       }
    
    }

   
    getImg = async()=>{
        if(this.state.user===null){
            return
        }
        if(!this.state.user.imgId){
            this.setState({build:true})
        }
        const imgId = this.state.user.imgId
        const imgUrl = await this.state.useDB.getImg(imgId)
        if(imgUrl){
            this.setState({imgUrl:imgUrl,build:true})
        }

    }

    loadInvitationUser = async()=>{
        const userInviArr = this.state.user.invitations
        const name = []
        const imgId = []
        const inviArr = await Promise.all(userInviArr.map(async(e)=> await this.state.useDB.getUser(e)))
        if(inviArr){
            for(let i of inviArr){
                name.push(i.userName)
                if(i.imgId){
                    imgId.push(i.imgId)
                }
            }
            const imgUrlArr = await Promise.all(imgId.map(async(e) => await this.state.useDB.getImg(e)))
            if(imgUrlArr){
                this.setState({
                    invitUserName:name,
                    invitUserImgUrl: imgUrlArr,
                })
            }
        }
    }

    invitationList = ()=> {
        const lines = [];
        for(let i in this.state.invitUserName){

            lines.push(
                <button className='invitationBtn' onClick={()=>this.setState({inviIndex: i, dialogCheck: true})}>
                    <div className='invitationImg'><Avatar name={this.state.invitUserName[i]} imgUrl={this.state.invitUserImgUrl[i]}/></div>
                    <FaUserPlus className='invitationIcon' size={20}/>
                </button>
            )  
        }
        const listItems = lines.map((message) =>
        <ListItem value={message} key={lines.indexOf(message) } />);
        return listItems;
    }

    addChatUser = async(i)=>{
        const u = this.state.user.invitations
        const invitations = []
        for(let j of this.state.user.invitations){
            if(j !== u[i]){
                invitations.push(j)
            }
        }
        const contacts = this.state.user.contacts
        contacts.push(u[i])
        const payload = {invitations, contacts}
        const updateUser = await this.state.useDB.updateUser(this.state.user._id, payload)
        if(updateUser){
            this.addUserCallback(updateUser)
            this.setState({user: updateUser, inviIndex: null},()=>this.loadInvitationUser())

        }
    }
    addUserCallback = (e)=>{
        this.props.update(e)
    }


    invitationUser = ()=>{
       return(
           <div className={!this.props.mobil?'invitationFrame':'invitationFrameMobil'}>
            {this.invitationList()}
           </div>
       )
    }
    menuClose = (e)=>{
        if(e){
            this.setState({dropdown:false})
        }
    }
    logoutHandle = (e)=>{
        this.setState({build:false})
        this.props.logout(e)
    }

    

    dialogCallback = (e)=>{
        if(e){
            this.setState({dialogCheck:false},()=>this.addChatUser(this.state.inviIndex))
        }else{
            this.setState({dialogCheck:false})
        }
    }


    userData(){
        const user = this.state.user
        if(this.state.build){
            const inviI = this.state.inviIndex
            return(
                <div className='topScreenDiv'>
                    <div className='topScreenLeftSide'>

                    </div>
                    <div className='topScreenRightSide'>
                        {this.invitationUser()}
                        <DialogCheck 
                            text={<div>möchtest du <div style={{fontWeight: "bold"}}>{this.state.invitUserName[inviI]}</div> zu dein kontakten hinzufügen ?</div>}
                            open={this.state.dialogCheck}
                            checked={this.dialogCallback}
                        />
                        <div className='topScreenUser'>{this.state.user.userName}</div>
                        <div className="topScreenImgDiv">
                            <Avatar name={user.userName} imgUrl={this.state.imgUrl}/>
                        </div>
                        <button className='topScreenMenuBtn' onClick={()=>this.setState({dropdown:true})}><MdMenu size={35}/></button>
                    </div>
                </div>
            )
        
        }else{
            return null
        }

   }


    

    render(){
        return(
            <div className='topScreen'>
                {this.userData()}
                <Menu open={this.state.dropdown} close={this.menuClose} logout={this.logoutHandle}/>
            </div>
        ); 
    }
}

export default Topbar;



  