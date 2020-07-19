import React from 'react';
import './chatverlauf.css'
import DbController from './../mongoController'
import DotLoader from "react-spinners/DotLoader";
import ImgView from './../dialogViewImg'






function ListItem(props) {
    return (<div>
                <div className= "chatValue">{props.value}</div>
            </div>);
}


export class Chatbox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            start:false,
            chatHistory:this.props.chatHistory,
            user:this.props.user,
            input:'',
            date: new Date(),
            contactName: this.props.contactName,
            contactPic: this.props.contactPic,
            contactId: this.props.contactId,
            useDB: DbController(),
            imgHistory:{id:[],url:[]},
            imgViewOpen:false,
            imgView:null,
        }
        this.backhandle = this.backhandle.bind(this)    
        this.imgLoad()             
    }


    componentDidUpdate(prevProps){
        this.scrollToBottom()
        if(this.props.chatHistory!==prevProps.chatHistory){
            this.setState({chatHistory:this.props.chatHistory},()=>this.imgLoad())
        }
        
    }
    

    componentDidMount() {
        setTimeout(()=>this.scrollToBottom(),60)    
    }
    
   
    // Dialog schließen ===>
    backhandle = (e) => {
            this.props.closeMess(e)
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }
    imgViewClose = (e)=>{
        if(e){
            this.setState({imgViewOpen:false})
        }

    }

    imgLoad = async()=>{ 
        const imgIdArr = [] 
        for(let i of this.state.chatHistory){
                if(i.imgId){
                    imgIdArr.push(i.imgId)
                }
        }
        const imgUrlArr = await Promise.all(imgIdArr.map(async(e) => await this.state.useDB.getImg(e)))
        if(imgUrlArr){
            const imgHistory = {id:imgIdArr,url:imgUrlArr}
            
            this.setState({imgHistory, start:true},()=>setTimeout(()=>this.scrollToBottom(),60))
        }
        
        
    }

    imgChatBlase = (i,user)=>{
        if(this.state.start){
            const count = this.state.imgHistory.id.findIndex(e => e ===i.imgId);
            
            return(
                <img className={user? 'imgBlase' : 'imgBlaseChatUser'}  onClick={()=>this.setState({imgViewOpen: true, imgView:this.state.imgHistory.url[count]})} src={this.state.imgHistory.url[count]} alt='...' />
            )
        }else{
            return(
                <div className='heicSpinnerChat'><DotLoader size={50} margin={2} color='#8873af' loading={true}/></div>
            )

        }
    }
    
      
    chatVerlauf = ()=> {
        const dateformat = { 
            month: 'long', 
            day: 'numeric',
            hour12: false,
            hour:  "2-digit",
            minute: "2-digit"
        };
        
        if(this.state.chatHistory===[]){
            return null
        }
        let user = true
        const lines = [];
        for(let i of this.state.chatHistory){
            if(i.message || i.imgId){
                if(i.user.userId!==this.state.contactId){
                    // ist flyeruser
                    user = false
                }else{
                    // ist homeuser
                    user = true
                }
                lines.push(
                    <div className={user? 'chatinList' : 'chatinListChatUser'}>
                        <div className={user? 'chatblase' : 'chatblaseChatUser'}>
                            <div className='chatMessage'>
                                {i.imgId?<div>{this.imgChatBlase(i,user)}</div>:null}
                                <div className={user? 'chatMessageBlase' : 'chatMessageBlaseChatUser'} >{i.message}</div>
                            </div>
                            <div className={user? 'chatdate' : 'chatdateChatUser'}>{new Date(i.date).toLocaleDateString('de-DE', dateformat)}</div>
                        </div>
                   </div>
                )
            }
        }
        const listItems = lines.map((message) =>
        <ListItem value={message} key={lines.indexOf(message) } />);
        return listItems; 
    }
        

    render(){
        return(
            <div className='chatFrame'>
                <div className='chatListVerlauf'>
                    {this.chatVerlauf()}
                    <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
                <ImgView open={this.state.imgViewOpen} imgUrl={this.state.imgView} close={this.imgViewClose}/>
            </div>
        )  
    }
        
    
}

export default Chatbox;



  