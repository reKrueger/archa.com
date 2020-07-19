import React from 'react';
import './index.css';
import Regis from './register'
import Topbar from './topbar'
import DotLoader from "react-spinners/DotLoader";
import DbController from './mongoController'
import Chat from './chat'







         


export class Home extends React.Component{
    constructor(props){
        super(props);
        this.state={
            mobil: false,
            use: 1,
            email:'',
            password:'',
            useDB: DbController(),
            user: null,
            newUser: null,
            invitation: false

                    
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
        this.frameToLogin = this.frameToLogin.bind(this)
        this.topbar = this.topbar.bind(this)
        this.use = this.use.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }


    componentDidMount() {
        window.addEventListener("resize", this.updateWindowDimensions());
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions)
    }
    
    updateWindowDimensions() {
        const mobil = window.innerWidth<=500
       this.setState({ mobil: mobil});
    }
    backHandleRegis=(e)=>{
        if(e){
            this.setState({use: 1})
        }
    }


    login = async()=>{
        const email = this.state.email
        const password = this.state.password
        if(email===''&&password===''){
            return
        }
        const payload = {email, password}
        const user= await this.state.useDB.getUserbyEAndP(payload)
        if(user){
            let e = false
            if(user.invitations.length>0){
                window.alert('du hast eine Freundschaftsanfrage')
                e = true
                
            }
            this.setState({user: user, use:4, invitation: e})
        }else{
            window.alert('email oder Passwort stimmen nicht')
            this.setState({use:1})
        }
    }

    newUser = (userDb)=>{
        this.setState({user: userDb, use:4})
    }
    addUser = (e)=>{
        if(e._id===this.state.user._id){
            this.setState({user: e, use:4})
        }  
    }
    logoutHandle = (e)=>{
        if(e){
            this.setState({
                user: null, 
                use: 1,
                email:'',
                password:'',
                newUser: null,
                invitation: false
            })
        }
    }

    frameToLogin(){
        return(
            <div className='loginframeDiv'>
                <div className='loginframeTxt1'>ARCHA</div>
                <div className='placeholderDiv'></div>
                <div className='loginframeTxt3'>Global Webtransmitter</div>
                <div className='placeholderDiv'></div>
                <div className='loginframeTxt2'>Willkommen!</div>
                <div className='loginframeTxt2'>log dich ein oder regestriere dich </div>
                <div className='placeholderDiv'></div>
                <div className='loginInputDiv'><input className='loginInput' type='text' name='email' placeholder='E-mail' value={this.state.email} onChange={this.handleChange}></input></div>
                <div className='placeholderDivHalf'></div>
                <div className='loginInputDiv'><input className='loginInput' type='password' name='password' placeholder='Passwort'value={this.state.password} onChange={this.handleChange}></input></div>
                <button className='loginBtn' onClick={()=>this.setState({use:3},()=>this.login())}>Login</button>
                <button className='regesBtn' onClick={()=>this.setState({use:2})}>regestrieren</button>

            </div>
        )
    }
    topbar(){
        return(
            <div className='topbarDivHome'>
                <Topbar user={this.state.user} invitation={this.state.invitation} update={this.addUser} mobil={this.state.mobil} logout={this.logoutHandle}
                />
            </div>
        )
    }

    use(){
        switch(this.state.use){
            case 1:
                return(
                    <div className='regisDivSwitch'>
                        {this.frameToLogin()}
                    </div>
                )
            // neuer User.....
            case 2:
                return(
                    <div className='regisDivSwitch'>
                        <Regis mobil={this.state.mobil} back={this.backHandleRegis} newUser={this.newUser}/>
                    </div>
                )
            // einloggen.....
            case 3:
                const loading = true
                return(
                    <div className='regisDivSwitch'>
                        <div className='loginframeDiv'>
                            <div className='placeholderDiv'></div>
                            <div className='loginframeTxt3'>lade... </div>
                            <div className='heicSpinner'><DotLoader size={50} margin={2} color='#8873af' loading={loading}/></div> 
                        </div>               
                    </div>
                )
            case 4:
                return(
                    <div className='regisDivSwitch'>
                        <div className='loginframeDiv'>
                            <Chat user={this.state.user}/>
                        </div>               
                    </div>
                )

            default: return null
        }
    }
    

    render(){
        return(
            <div className='homeScreen'>
                {this.topbar()}
                <div className='loginFrame'>
                    {this.use()}
                </div>
            </div>
        ); 
    }
}

export default Home;



  