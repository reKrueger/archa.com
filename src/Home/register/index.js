import React from 'react';
import './index.css';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import ImgSize from './../imgClass'
import DotLoader from "react-spinners/DotLoader";
import DbController from './../mongoController'
import DialogFail from './../dialogFail'




export class Regis extends React.Component{
    constructor(props){
        super(props);
        this.state={
            step: 1,
            email:'',
            phone:'',
            userName:'',
            password:'',
            img:'',
            imgUrl:'',
            noImg: true,
            imgId: null,
            insertNewUser: false,
            dateLogin: new Date().toLocaleDateString(),
            useDB: DbController(),
            openDialogFail: false,
            text: ''

                    
        }
        this.regisSteps = this.regisSteps.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.navibuttons = this.navibuttons.bind(this)
        this.profilImg = this.profilImg.bind(this)
        this.insertNewUser = this.insertNewUser.bind(this)
    }


    
    
    back=(e)=>{
        this.props.back(e)
    }
    handleChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }
    croppedImg = async (e)=>{ 
        const picName = this.state.userName
        let file = await fetch(e)
        .then(r => r.blob())
        .then(blobFile => new File([blobFile], picName, {type: "image/png" }))
        this.setState({
            img:file,
            imgUrl:e,
            noImg:false, 
        })
    }
    insertImg = async()=>{
        // neuer User ohne Profilbild......
        if(!this.state.imgUrl){
            const {userName, email, password, phone, dateLogin} = this.state
            const payload = {userName, email, password, phone, dateLogin}
            if(userName===''|| email===''|| password===''){
                const txt = 'um sich anzumelden, müssen die Felder Email, Benutzernamen und passwort ausgefüllt sein!'
                return this.setState({text: txt, openDialogFail:true})
            }
            const userDb = await this.state.useDB.newUserSave(payload)
            if (userDb){
                return this.props.newUser(userDb)
            }
        }
        const img = this.state.img
        const id = await this.state.useDB.imgSave(img)
        if(id){
            this.insertNewUser(id)
        }
    }

    insertNewUser= async(id)=>{
        const imgId = id
        const {userName, email, password, phone, dateLogin} = this.state
        const payload = {userName, email, password, phone, dateLogin, imgId}
        const userDb = await this.state.useDB.newUserSave(payload)
        if (userDb){
            this.props.newUser(userDb)
        }


    }



    profilImg(){
        if(this.state.noImg){
            return(
                <div className="regisImgDiv">
                    <ImgSize img={this.croppedImg} />
                </div>
            )
        }
        return(
            <div className="regisImgDiv">
                <img className='regisImg' src={this.state.imgUrl} alt={this.state.userName}></img>
                <button className='regisImgBtn' onClick={()=>this.setState({noImg:true})}>x</button>
            </div>
        );                    
    }
    

    regisSteps(){
        switch(this.state.step){
            case 1:
                return(
                    <div className='regisStepsDiv'>
                        <div className='loginframeTxt2'>Telefonnummer:</div>
                        <div className='regisInputDiv'><input className='regisInput' type='number' name='phone' value={this.state.phone} onChange={this.handleChange}></input></div>
                        <div className='loginframeTxt2'>oder</div>
                        <div className='loginframeTxt2'>E-mail:</div>
                        <div className='regisInputDiv'><input className='regisInput' type='email' name='email' value={this.state.email} onChange={this.handleChange}></input></div>
                    </div>
                )
            case 2:
                return(
                    <div className='regisStepsDiv'>
                        {this.profilImg()}
                        <div className='loginframeTxt2'>Benutzername:</div>
                        <div className='regisInputDiv'><input className='regisInput' type='text' name='userName' value={this.state.userName} onChange={this.handleChange}></input></div>
                        <div className='loginframeTxt2'></div>
                        <div className='loginframeTxt2'>Passwort:</div>
                        <div className='regisInputDiv'><input className='regisInput' type='text' name='password' value={this.state.password} onChange={this.handleChange}></input></div>
                    </div>
                )
            case 3:
                const loading = this.state.insertNewUser
                return(
                    <div className='regisStepsDiv'>
                        <div className='loginframeTxt2'>erstellt</div>
                        <div className='loginframeTxt2'>Benutzer</div>
                        <div className='heicSpinner'><DotLoader size={50} margin={2} color='#2bb99a' loading={loading}/></div>
                    </div>
                )
            default:
                return(null)
        }
    }

    navibuttons(){
        if(this.state.step===1){
            return(
                <div className="regisStepsBtnDiv">
                    <button className="regisStepsBtnBack" onClick={()=>{this.state.step===1?this.back(true):this.setState({step: this.state.step - 1})}}>
                        <MdKeyboardArrowLeft size={40}/>
                        <div className="regisStepsTextBtn">zurück</div>
                    </button>   
                    <button className="regisStepsBtnNext" onClick={()=>{this.setState({step: this.state.step + 1})}}>
                        <div className="regisStepsTextBtn">weiter</div>
                        <MdKeyboardArrowRight size={40}/>
                    </button>  
                </div> 
            )
        }else if(this.state.step===2){
            return(
                <div className="regisStepsBtnDiv">
                    <button className="regisStepsBtnBack" onClick={()=>{this.setState({step: this.state.step - 1})}}>
                        <MdKeyboardArrowLeft size={40}/>
                        <div className="regisStepsTextBtn">zurück</div>
                    </button> 
                    <button className="regisStepsBtnNext" onClick={()=>this.setState({step: this.state.step + 1,insertNewUser:true},()=>{this.insertImg()})}>
                        <div className="regisStepsTextBtn">erstellen</div>
                        <MdKeyboardArrowRight size={40}/>
                    </button> 
                </div> 
            )
        }else{
            
        }
    }
    

    userFail = ()=>{
        this.setState({openDialogFail:false, step:1})
    }

    

    render(){
        return(
            <div className='regisScreen'>
            {this.regisSteps()}
            {this.navibuttons()}
            <DialogFail text={this.state.text} open={this.state.openDialogFail} failChecked={this.userFail}/>
                
            </div>
        ); 
    }
}

export default Regis;



  