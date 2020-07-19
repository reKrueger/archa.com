import React from 'react';
import './index.css';
import Dialog from '@material-ui/core/Dialog';




export class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state={
            open: this.props.open,
            imgUrl: this.props.imgUrl
        }
      
    }


    componentDidUpdate(prevProps){
        if(this.props.open!==prevProps.open){
            this.setState({open:this.props.open})
        }
    }

    close = ()=>{
        this.props.close(true)
    }
    logoutHandle = ()=>{
        this.props.logout(true)
    }

    

    render(){
        return(
            <Dialog 
            className='menuDialog'
            onClick= {()=>this.close()}
            open={this.state.open===true}
            fullScreen>
                <div className='topbarDropdownFrame'>
                    <button className='topbarDropdownBtn' >Profil</button>
                    <button className='topbarDropdownBtn' >Datenbank</button>
                    <button className='topbarDropdownBtn' >Einstellungen</button>
                    <button className='topbarDropdownBtn' >Verlauf</button>
                    <button className='topbarDropdownBtn' >über Archa</button>
                    <button className='topbarDropdownBtn' >Impressum</button>
                    <button className='topbarDropdownBtn' onClick={()=>this.logoutHandle()} >Ausloggen</button>
                </div>
            </Dialog>
        ); 
    }
}

export default Menu



  