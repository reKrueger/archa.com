import React from 'react';
import './index.css';




export class Avatar extends React.Component{
    constructor(props){
        super(props);
        this.state={
            name: this.props.name,
            imgUrl: this.props.imgUrl,
        }
    }

    

    
    componentDidUpdate(prevProps){
        if(this.props.name!==prevProps.name){
            this.setState({user:this.props.name})
        }
        if(this.props.imgUrl!==prevProps.imgUrl){
            this.setState({imgUrl:this.props.imgUrl})
        }
    
    }

    
    
    stringToColor = (str)=> {
        let hash = 0
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash)
          }
          var colour = '#';
          for (var j = 0; j < 3; j++) {
            var value = (hash >> (j * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2)
          }
          return colour;
        }
    

    

    render(){
        const divStyle = {
            background: this.stringToColor(this.state.name)
        }
        const ava = this.state.name.charAt(0)
        const url = this.props.imgUrl
        let lastPart = 1
        if(url){
            lastPart = url.substr(url.lastIndexOf('/') + 1);
        }
        if(!this.props.imgUrl || this.props.imgUrl===undefined || lastPart==='null' || lastPart==='undefined'){
            return(
                <div className='avatar' style = {divStyle}>{ava}</div>
            )
        }else{
            return(
                <img className='avatar' src={this.state.imgUrl} alt={this.state.name}/>
            )
            
            
        }
        
    }
}

export default Avatar;



  