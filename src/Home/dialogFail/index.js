import React from 'react';
import './index.css';
import Dialog from '@material-ui/core/Dialog';







         


export class DialogFail extends React.Component{
    constructor(props){
        super(props);
        this.state={
            text: this.props.text,
            open: this.props.open,
        }
      
    }


    componentDidUpdate(prevProps){
        if(this.props.open!==prevProps.open){
            this.setState({open:this.props.open})
        }
        if(this.props.text!==prevProps.text){
            this.setState({text:this.props.text})
        }
    }

    dialogText = ()=>{
        return(
            <div className='dialogCheckText'>{this.state.text}</div>
        )
    }
    dialogCallback = (e)=>{
        this.props.failChecked(e)
    }

    

    render(){
        return(
            <Dialog 
            className='checkDialog'
            open={this.state.open===true}
            fullScreen>
                <div className='dialogCheckFrame'>
                    {this.dialogText()}
                    <div className='placeholderDiv'></div>
                    <div className='dialogCheckBtnDiv'>
                        <button className='dialogCheckBtn' onClick={()=>this.dialogCallback(true)}>Ok</button>
                    </div>
                </div>
            </Dialog>
        ); 
    }
}

export default DialogFail;



  