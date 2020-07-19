import React, { Fragment } from 'react'
import Cropper from 'react-easy-crop'
import { getOrientation } from 'get-orientation/browser'
import getCroppedImg from './cropImage'
import { getRotatedImage } from './rotateImage'
import './index.css'
import Dialog from '@material-ui/core/Dialog';
import { FiCamera} from "react-icons/fi";
import { GoX } from "react-icons/go";
import heic2any from "heic2any";
import DotLoader from "react-spinners/DotLoader";




const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6':  0,
  '8': -90,
}



class ImgSize extends React.Component {
  constructor(props){
    super(props);
    this.state={
      imageSrc: null,
      crop: { x: 0, y: 0 },
      zoom: 2,
      aspect: 1 / 1,
      croppedAreaPixels: null,
      croppedImage: null,
      isCropping: false,
      correctImg: null,
      file: null,
      heicFile:null,
      heicLoad: false,
    }
  }


  onCropChange = crop => {
    this.setState({ crop })
  }

  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      croppedAreaPixels,
    })
  }

  onZoomChange = zoom => {
    this.setState({ zoom })
  }

  showResult = async () => {
    try {
      this.setState({
        isCropping: true,
      })
      const croppedImage = await getCroppedImg(
        this.state.imageSrc,
        this.state.croppedAreaPixels
      )
      this.setState({
        croppedImage,
        isCropping: false,
      },()=>this.callbackCorrectImg(croppedImage))
    } catch (e) {
      this.setState({
        isCropping: false,
      },()=>this.onClose())
    }
  }

  // callback cropped Image......
  callbackCorrectImg = async (e) =>{
    this.props.img(e)
    this.setState({correctImg: e})
    this.close()
  }

  


  onClose = async () => {
    this.setState({
      croppedImage: null,
    })
  }

  rotation = async () => {
    if(this.state.file=== null){
      return
    }
    const file = this.state.file
      let imageDataUrl = await readFile(file)

      // auto rotation.....
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }
      this.setState({
        imageSrc: imageDataUrl,
        crop: { x: 0, y: 0 },
        zoom: 1,
      })
    
  }


  isHeic = async file =>{
    await heic2any({
      blob: file,
      toType: "image/png",
      multiple: false,
      quality: 0.8
    })
      .then(res=> {
        this.setState({heicFile:res},()=>this.onHeicFileChange())
      })
    .catch((e) => {
      console.log('catch file')
      console.log(e)
    });
    

    
  }

  onHeicFileChange = async()  => {
    const heicImg = this.state.heicFile
    let imageDataUrl = await readFile(heicImg)

    // auto rotation.....
    const orientation = await getOrientation(heicImg)
    const rotation = ORIENTATION_TO_ANGLE[orientation]
    if (rotation) {
       imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
    }
    this.setState({
      file: heicImg,
      heicLoad:false,
      imageSrc: imageDataUrl,
      crop: { x: 0, y: 0 },
      zoom: 1,
    })
  }

  onFileChange = async e => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if(file.type==='image/heic'){
        this.setState({heicLoad:true},()=>this.isHeic(file))
        return
      }
      let imageDataUrl = await readFile(file)

      // auto rotation.....
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }
      this.setState({
        file: file,
        imageSrc: imageDataUrl,
        crop: { x: 0, y: 0 },
        zoom: 1,
      })
    }
  }



  


  close = async ()=>{
      this.setState({imageSrc:null})
  }

  spinner = ()=>{
    const loading = this.state.heicLoad
    if(loading){
      return(
        <div className='heicSpinner'><DotLoader size={50} margin={2} color='#8873af' loading={loading}/></div>
      )
    }else{
      return(
        <button className="fakefile"><FiCamera size={30}/></button>
      )
    }
 }

  render() {
    return (
      <div className="App">
        <div className="ggg">
          <div className="picPos">
            <div className="imgPadd">{this.spinner()}</div>
            <input id="fileInput" className="hidden" type="file" accept="image/* .heic" multiple="multiple" onChange={this.onFileChange}/>  
            </div>
          </div>
          <Dialog 
          className='ImgSizeDialog'
          open={!!this.state.imageSrc}
          fullScreen>
          <div className='imgSizeFrame'>
            <div className='imgSizeHeadDiv'>
            <button className="imgSizeHeadDivReturnBtn"
                    onClick={()=>{this.setState({imageSrc: null})}}
                    disabled={this.state.isCropping}>
                    <GoX className='imgSizeHeadDivReturnIcon' size={25}/>
            </button>
            </div>
            {this.state.imageSrc && (
            <Fragment>
              <div className="crop-container">
                <Cropper
                  image={this.state.imageSrc}
                  crop={this.state.crop}
                  zoom={this.state.zoom}
                  aspect={this.state.aspect}
                  onCropChange={this.onCropChange}
                  onCropComplete={this.onCropComplete}
                  onZoomChange={this.onZoomChange}
                  showGrid={false}
                />
              </div>
                <div className="buttonAuswahlConImgSize">
                  <button className="buttonAuswahl" onClick={this.showResult} disabled={this.state.isCropping}>Auswahl</button>
                </div>
          </Fragment>
        )}
        </div>
        </Dialog>
      </div>
     
    )
  }
}

function readFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}


export default ImgSize;