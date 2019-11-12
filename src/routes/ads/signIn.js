
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {Form, FormGroup, Input, Label} from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import AppConfig from 'Constants/AppConfig';

import IntlMessages from "Util/IntlMessages";
import LanguageProvider from "Components/Header/LanguageProvider";
import { Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import './ads.css';
import {getToken} from "../../container/Shared";
import api from 'Api';
import UrlPhoto from "Constants/UrlPhoto";
const headers={'Content-Type': 'application/json','Authorization':'Bearer '+getToken()}

export default class SignIn extends Component{

//location of ad for singIn is 0
    /****************************************************************************************************************************************/
    constructor(props)
    {
        super(props)
        this.state = {
            photoModal: false,
            filesLength:0,
            photoUploaded:'',
            adExist:0,// 0 no ad 1 there is an ad
            ad:null,
            adUrl:'',
            adPhoto:'',
            editAd:0,
            userClickToChangeImg:0,
            photoUploadedSucc:0,
            photo:'',
        };
    }
    /************************************************************************************************************************************/
    getAd()
    {
        api.get('getAd/0')
            .then((response)=>{
                if(response.data.result==='1')  //there is an ad for singin page
                {
                    this.setState({adExist:1,ad:response.data.ad},()=>{
                        this.setState({adPhoto:this.state.ad.adPhoto,adUrl:this.state.ad.adUrl})
                    })
                }
            })
            .catch(error =>{NotificationManager.error('',<IntlMessages id="button.error"/>)})
    }
    /************************************************************************************************************************************/
    componentWillMount()
    {
      this.getAd();
    }
    /************************************************************************************************************************************/
    handleImgChange = event => {
        let files = event.target.files || event.dataTransfer.files;
        this.setState({filesLength: files.length})


        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({photoUploaded: e.target.result,photoUploadedSucc:1})
        };
        reader.readAsDataURL(files[0])
    }
    /************************************************************************************************************************************/
    upload()
    {
        this.setState({photoModal:false})
        if(this.state.filesLength>0)
        {
            api.post( 'createAnAd',
                      {
                          adUrl:this.state.adUrl,  //not required
                          file:this.state.photoUploaded, //required
                          adLocation:0  //0 for signIn page
                      },
                      {headers:headers}
                    )
                .then((response)=>
                {
                    if(response.data.result!==null)
                    {
                        this.setState({filesLength: 0,adExist:1,userClickToChangeImg:1,photoUploadedSucc:0,photo:this.state.photoUploaded})
                    }
                })
                .catch(error => NotificationManager.error('Error!'))
        }
        else
            NotificationManager.error('choose a photo !')
    }
    /*******************************************************************************************************/
    togglePhotoModal()
    {
        this.setState({photoModal: !this.state.photoModal});
    }
    /*******************************************************************************************************/
    editAd()
    {
        this.togglePhotoModal();
        this.setState({editAd:1})
    }
    /*******************************************************************************************************/
    updateAd()
    {
        this.setState({photoModal:false,editAd:0})
        api.post(
                    'updateAd',
                    {
                        adUrl:this.state.adUrl,  //not required
                        file:this.state.photoUploaded, //required
                        adLocation:0  //0 for signIn page
                    },
                    {headers:headers}
               )
            .then((response)=>{
                if(response.data.result==='1') {this.setState({filesLength: 0,userClickToChangeImg:1,photoUploadedSucc:0,photo:this.state.photoUploaded})}
            })
    }
    /*******************************************************************************************************/
    deleteAd()
    {
        api.get('deleteAd/0', {headers:headers})
            .then((response)=>{
                if(response.data.result==='1')  //there is an ad for singin page
                {
                    this.setState({adExist:0,ad:null,photoUploaded:'',adPhoto:null,adUrl:'',userClickToChangeImg:0,photo:''})
                }
            })
            .catch(error =>{NotificationManager.error('',<IntlMessages id="button.error"/>)})
    }
    /*******************************************************************************************************/
    render() {
        const isEnabled = this.state.photoUploaded!=='';
        return (
            <div className="user-management" >
                <h1><IntlMessages id="widgets.signInAdManagement"/></h1>
                <br/>
                <div className="rct-session-wrapper" style={{ backgroundImage: "url(/static/media/rct-session-banner.2163e1a1.jpg)"}}>
                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                            <img src={AppConfig.appLogo} alt="session-logo"  width="70" height="70" />
                                    </div>
                                    <div>
                                        <LanguageProvider />
                                        <Button variant="raised" className="btn-light"> <IntlMessages id="widgets.signUp" /></Button>
                                        &nbsp;&nbsp;
                                        <a className="mr-15" >Create New account?</a>
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="session-inner-wrapper">
                        <div className="container">
                            <div className="row row-eq-height" >
                                <div className="col-sm-7 col-md-7 col-lg-8" style={{marginBottom:"4vw"}}>
                                    <div className="session-body text-center">
                                        <div className="session-head mb-40">
                                            <h1 className="font-weight-bold" style={{color :"#04187a"}}>{AppConfig.brandName}</h1>
                                        </div>
                                        <Form>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="email"
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder="email"
                                                />
                                                <span className="has-icon"><i className="ti-email"></i></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input

                                                    type="Password"
                                                    name="user-pwd"
                                                    id="pwd"
                                                    className="has-input input-lg"
                                                    placeholder="password"
                                                />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="raised"
                                                    size="large"
                                                >
                                                    <IntlMessages id="compenets.signIn" />
                                                </Button>
                                            </FormGroup>
                                        </Form>
                                        <p className="mb-20">or sign in with</p>
                                        <Button
                                            variant="fab"
                                            mini
                                            className="btn-facebook mr-15 mb-20 text-white"
                                        >
                                            <i className="zmdi zmdi-facebook"></i>
                                        </Button>

                                        <Button
                                            variant="fab"
                                            mini
                                            className="btn-google mr-15 mb-20 text-white"

                                        >
                                            <i className="zmdi zmdi-google"></i>
                                        </Button>
                                        <Button
                                            variant="fab"
                                            mini
                                            className="btn-twitter mr-15 mb-20 text-white"
                                        >
                                            <i className="zmdi zmdi-twitter"></i>
                                        </Button>
                                        <p className="mb-0"><a target="_blank" href="#/terms-condition" className="text-muted">Informations de compte oubliées ?</a></p>
                                    </div>
                                </div>
                                <div className="col-sm-1 col-md-1 col-lg-1" >
                                    <p style={{display:"hidden"}}></p>
                                </div>
                                <div className="col-sm-4 col-md-4 col-lg-3" style={{float:"right"}}  style={{marginBottom:"4vw"}}>
                                    {this.state.adExist===0  ?
                                        <div>
                                            <img
                                            style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                            src={require('Assets/img/adLoginRegister.jpg')}
                                            alt="session-slider"
                                            className="img-fluid"
                                            width="377"
                                            height="588"
                                        />
                                            <br/>
                                            <Button onClick={() => this.togglePhotoModal()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large"
                                                    style={{marginTop:"10px"}} >Add Advertisement</Button>
                                        </div>
                                        :
                                        <div>
                                            {this.state.userClickToChangeImg===0 ?
                                                <img
                                                    style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                    src={UrlPhoto.urlphoto + this.state.adPhoto}
                                                    alt="session-slider"
                                                    className="img-fluid"
                                                    width="377"
                                                    height="588"
                                                    />
                                            : this.state.userClickToChangeImg===1 ?
                                                    this.state.photoUploadedSucc===0 ?
                                            <img
                                                style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                src={this.state.photoUploaded}
                                                alt="session-slider"
                                                className="img-fluid"
                                                width="377"
                                                height="588"
                                            />
                                            :
                                            <img
                                                style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                src={this.state.photo}
                                                alt="session-slider"
                                                className="img-fluid"
                                                width="377"
                                                height="588"
                                            />
                                            :''
                                            }
                                            <Button onClick={() => this.editAd()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large"   style={{marginTop:"10px"}}>Edit Advertisement</Button>{' '}

                                            <Button onClick={() => this.deleteAd()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large">Delete Advertisement</Button>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.photoModal} toggle={() => this.togglePhotoModal()} className={this.props.className}>
                    <ModalHeader toggle={() => this.togglePhotoModal()} style={{color:"#5d92f4"}}>
                        {
                            this.state.editAd === 0 ?
                                <p>Create Add</p>
                                :
                                <p>Update Add</p>
                        }
                    </ModalHeader>
                    <ModalBody>
                        <div className="user-image  mb-30">
                            <Form>
                                <FormGroup>
                                    <Input
                                        placeholder="Advertisement Url"
                                        type="text"
                                        name="adUrl"
                                        id="adUrl"
                                        value={this.state.adUrl}
                                        onChange={(e) => this.setState({adUrl: e.target.value})}
                                    />
                                </FormGroup>
                                    <input type="file" name="file" accept="image/*" onChange={this.handleImgChange}/>
                            </Form>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.editAd === 0 ?
                                <Button variant="raised" className="primary" onClick={() => this.upload()} disabled={!isEnabled}>Save</Button>
                                :
                                <Button variant="raised" className="primary" onClick={() => this.updateAd()} >Update</Button>
                        }
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

