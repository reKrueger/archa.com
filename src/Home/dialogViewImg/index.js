import React from 'react';
import './index.css';
import Dialog from '@material-ui/core/Dialog';
import { GoX } from "react-icons/go";







         


export class ViewImg extends React.Component{
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
        if(this.props.imgUrl!==prevProps.imgUrl){
            this.setState({imgUrl:this.props.imgUrl})
        }
    }

    dialogText = ()=>{
        return(
            <div className='dialogCheckText'>{this.state.text}</div>
        )
    }
    close = ()=>{
        this.props.close(true)
    }

    

    render(){
        return(
            <Dialog 
            className='imgViewDialog'
            open={this.state.open===true}
            fullScreen>
                <div className='imgViewHead'><button className='chatheadBtn' onClick={()=>this.close()}><GoX size={36}/></button></div>
                <div className='imgViewFrame'>
                    <div className='imgViewDiv'><img className='imgViewImg' src={this.state.imgUrl} alt='...'/></div>
                </div>
            </Dialog>
        ); 
    }
}

export default ViewImg;



  