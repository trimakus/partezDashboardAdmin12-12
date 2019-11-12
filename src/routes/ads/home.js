
import React, { Component,Fragment } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from 'react-bootstrap/Card'
import Typography from "@material-ui/core/Typography";
import {Form, FormGroup, Label,Col, Input,Badge, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
import {RctCard} from "Components/RctCard";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";

import './ads.css';
import {getToken} from "../../container/Shared";
import api from 'Api';
import UrlPhoto from "Constants/UrlPhoto";

const headers={'Content-Type': 'application/json','Authorization':'Bearer '+getToken()}

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}
export default class Home extends Component{

//location of ad for home right side is 2 , home left side is 3
    /****************************************************************************************************************************************/
    constructor(props)
    {
        super(props)
        this.state = {
            activeTab:0,
            photoModalLeft: false,
            adExistLeft:0,
            adLeft:null,
            adUrlLeft:'',
            adPhotoLeft:'',
            photoLeft:'',
            userClickToChangeImgLeft:0,
            photoUploadedSuccLeft:0,
            photoUploadedLeft:'',
            filesLengthLeft:0,
            editAdLeft:0,

            photoModalRight: false,
            adExistRight:0,
            adRight:null,
            adUrlRight:'',
            adPhotoRight:'',
            photoRight:'',
            userClickToChangeImgRight:0,
            photoUploadedSuccRight:0,
            photoUploadedRight:'',
            filesLengthRight:0,
            editAdRight:0,
        };
    }
    /************************************************************************************************************************************/
    getAdLeft()
    {
        api.get('getAd/3', {headers:headers})
            .then((response)=>{
                if(response.data.result==='1')  //there is an ad for singin page
                {
                    this.setState({adExistLeft:1,adLeft:response.data.ad},()=>{
                        this.setState({adPhotoLeft:this.state.adLeft.adPhoto,adUrlLeft:this.state.adLeft.adUrl})
                    })
                }
            })
            .catch(error =>{NotificationManager.error('',<IntlMessages id="button.error"/>)})
    }
    /************************************************************************************************************************************/
    getAdRight()
    {
        api.get('getAd/2', {headers:headers})
            .then((response)=>{
                if(response.data.result==='1')  //there is an ad for singin page
                {
                    this.setState({adExistRight:1,adRight:response.data.ad},()=>{
                        this.setState({adPhotoRight:this.state.adRight.adPhoto,adUrlRight:this.state.adRight.adUrl})
                    })
                }
            })
            .catch(error =>{NotificationManager.error('',<IntlMessages id="button.error"/>)})
    }
    /************************************************************************************************************************************/
    componentWillMount()
    {
        this.getAdLeft();
        this.getAdRight();
    }
    /************************************************************************************************************************************/
    togglePhotoModalLeft()
    {
        this.setState({photoModalLeft: !this.state.photoModalLeft});
    }
    /*******************************************************************************************************/
    togglePhotoModalRight()
    {
        this.setState({photoModalRight: !this.state.photoModalRight});
    }
    /*******************************************************************************************************/
    handleImgChangeLeft = event => {
        let files = event.target.files || event.dataTransfer.files;
        this.setState({filesLengthLeft: files.length})


        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({photoUploadedLeft: e.target.result,photoUploadedSuccLeft:1})
        };
        reader.readAsDataURL(files[0])
    }
    /************************************************************************************************************************************/
    handleImgChangeRight = event => {
        let files = event.target.files || event.dataTransfer.files;
        this.setState({filesLengthRight: files.length})


        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({photoUploadedRight: e.target.result,photoUploadedSuccRight:1})
        };
        reader.readAsDataURL(files[0])
    }
    /************************************************************************************************************************************/
    uploadLeft()  // 2 Right ou 3 left
    {
        this.setState({photoModalLeft:false})
        if(this.state.filesLengthLeft>0)
        {
            api.post( 'createAnAd',
                {
                    adUrl:this.state.adUrlLeft,
                    file:this.state.photoUploadedLeft,
                    adLocation:3
                },
                {headers:headers}
            )
                .then((response)=>
                {
                    if(response.data.result!==null)
                    {
                        this.setState({filesLengthLeft: 0,adExistLeft:1,userClickToChangeImgLeft:1,photoUploadedSuccLeft:0,photoLeft:this.state.photoUploadedLeft})
                    }
                })
                .catch(error => NotificationManager.error('Error!'))
        }
        else
            NotificationManager.error('choose a photo !')
    }
    /*******************************************************************************************************/
    uploadRight()  // 2 Right ou 3 left
    {
        this.setState({photoModalRight:false})
        if(this.state.filesLengthRight>0)
        {
            api.post( 'createAnAd',
                {
                    adUrl:this.state.adUrlRight,
                    file:this.state.photoUploadedRight,
                    adLocation:2
                },
                {headers:headers}
            )
                .then((response)=>
                {
                    if(response.data.result!==null)
                    {
                        this.setState({filesLengthRight: 0,adExistRight:1,userClickToChangeImgRight:1,photoUploadedSuccRight:0,photoRight:this.state.photoUploadedRight})
                    }
                })
                .catch(error => NotificationManager.error('Error!'))
        }
        else
            NotificationManager.error('choose a photo !')
    }
    /*******************************************************************************************************/
    editAdLeft()
    {
        this.togglePhotoModalLeft();
        this.setState({editAdLeft:1})
    }
    /*******************************************************************************************************/
    editAdRight()
    {
        this.togglePhotoModalRight();
        this.setState({editAdRight:1})
    }
    /*******************************************************************************************************/
    updateAdLeft()
    {
        this.setState({photoModalLeft:false,editAdLeft:0})
        api.post(
            'updateAd',
            {
                adUrl:this.state.adUrlLeft,  //not required
                file:this.state.photoUploadedLeft, //required
                adLocation:3  //0 for signIn page
            },
            {headers:headers}
        )
            .then((response)=>{
                if(response.data.result==='1') {this.setState({filesLengthLeft: 0,userClickToChangeImgLeft:1,photoUploadedSuccLeft:0,photoLeft:this.state.photoUploadedLeft})}
            })
    }
    /*******************************************************************************************************/
    updateAdRight()
    {
        this.setState({photoModalRight:false,editAdRight:0})
        api.post(
            'updateAd',
            {
                adUrl:this.state.adUrlRight,  //not required
                file:this.state.photoUploadedRight, //required
                adLocation:2  //0 for signIn page
            },
            {headers:headers}
        )
            .then((response)=>{
                if(response.data.result==='1') {this.setState({filesLengthRight: 0,userClickToChangeImgRight:1,photoUploadedSuccRight:0,photoRight:this.state.photoUploadedRight})}
            })
    }
    /*******************************************************************************************************/
    deleteAdLeft()
    {
        api.get('deleteAd/3', {headers:headers})
            .then((response)=>{
                if(response.data.result==='1')  //there is an ad for singin page
                {
                    this.setState({adExistLeft:0,adLeft:null,photoUploadedLeft:'',adPhotoLeft:null,adUrlLeft:'',userClickToChangeImgLeft:0,photoLeft:''})
                }
            })
            .catch(error =>{NotificationManager.error('',<IntlMessages id="button.error"/>)})
    }
    /*******************************************************************************************************/
    deleteAdRight()
    {
        api.get('deleteAd/2', {headers:headers})
            .then((response)=>{
                if(response.data.result==='1')  //there is an ad for singin page
                {
                    this.setState({adExistRight:0,adright:null,photoUploadedright:'',adPhotoRight:null,adUrlRight:'',userClickToChangeImgright:0,photoRight:''})
                }
            })
            .catch(error =>{NotificationManager.error('',<IntlMessages id="button.error"/>)})
    }
    /*******************************************************************************************************/

    render() {
        const isEnabledLeft = this.state.photoUploadedLeft!=='';
        const isEnabledRight = this.state.photoUploadedRight!=='';
        const { activeTab } = this.state;

        return (
            <div className="user-management" >
                <h1><IntlMessages id="widgets.homeAdManagement"/></h1>
                <br/>
                <div className="userProfile-wrapper">
                    <RctCard>

                        <div className="profile-top mb-20">
                            <img src={require('Assets/img/profile-bg.jpg')} alt="profile banner" className="img-fluid" width="1920" height="345" />
                            <div className="profile-content">
                                <div className="media">
                                    <img src={require('Assets/img/user-8.jpg')} alt="user profile"
                                         className="rounded-circle mr-30 bordered" width="140" height="140"/>
                                    <div className="media-body pt-25">
                                        <div className="mb-20">
                                            <h2>John Doe</h2>
                                            <Button variant="raised" color="primary" className="text-white">update photo</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rct-tabs">
                            <AppBar position="static">
                                <Tabs
                                    value={activeTab}
                                    scrollable
                                    scrollButtons="off"
                                    indicatorColor="primary"
                                >
                                    <Tab
                                        icon={<i className="zmdi zmdi-calendar-note"></i>}
                                        label="Events"
                                    />
                                    <Tab
                                        icon={<i className="zmdi zmdi-gps-dot"></i>}
                                        label="Nearby Events"
                                    />
                                    <Tab
                                        icon={<i className="zmdi zmdi-favorite"></i>}
                                        label="Favorite Events"
                                    />
                                </Tabs>
                            </AppBar>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-3 col-lg-3 w-xs-full" style={{marginTop:"4.8vw"}}>
                                <div>
                                    {this.state.adExistLeft===0  ?
                                        <div>
                                            <img
                                                style={{display: "block", marginLeft: "auto",marginRight: "auto"}}
                                                src={require('Assets/img/adLoginRegister.jpg')}
                                                alt="session-slider"
                                                className="img-fluid"
                                                width="377"
                                                height="588"
                                            />
                                            <br/>
                                            <Button onClick={() => this.togglePhotoModalLeft()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large"
                                                    style={{marginTop:"10px",marginBottom:"10px"}} >Add Advertisement</Button>
                                        </div>
                                        :
                                        <div>
                                            {this.state.userClickToChangeImgLeft===0 ?
                                                <img
                                                    style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                    src={UrlPhoto.urlphoto + this.state.adPhotoLeft}
                                                    alt="session-slider"
                                                    className="img-fluid"
                                                    width="377"
                                                    height="588"
                                                />
                                                : this.state.userClickToChangeImgLeft===1 ?
                                                    this.state.photoUploadedSuccLeft===0 ?
                                                        <img
                                                            style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                            src={this.state.photoUploadedLeft}
                                                            alt="session-slider"
                                                            className="img-fluid"
                                                            width="377"
                                                            height="588"
                                                        />
                                                        :
                                                        <img
                                                            style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                            src={this.state.photoLeft}
                                                            alt="session-slider"
                                                            className="img-fluid"
                                                            width="377"
                                                            height="588"
                                                        />
                                                    :''
                                            }
                                            <Button onClick={() => this.editAdLeft()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large"   style={{marginTop:"10px"}}>Edit Advertisement</Button>{' '}

                                            <Button onClick={() => this.deleteAdLeft()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large">Delete Advertisement</Button>
                                        </div>
                                    }

                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-lg-6 w-xs-full">
                                {activeTab === 0 &&
                                <TabContainer>
                                    <div>
                                        <FormGroup row>
                                            <Col sm={4} style={{marginLeft: "5vw"}}>
                                                <Label><Input type="radio" checked disabled/> Past Event</Label>
                                            </Col>
                                            <Col sm={4} style={{marginLeft: "5vw"}}>
                                                <Label><Input type="radio" disabled/> Upcoming Events</Label>
                                            </Col>
                                        </FormGroup>
                                        <Card>
                                            <Card.Body>
                                                <Card.Text>
                                                    <Fragment>
                                                        <div className="media-listing">
                                                            <ul className="list-unstyled">
                                                                <li className="media border-bottom">
                                                                    <div className="mr-10"></div>
                                                                    <img
                                                                        src={require('Assets/img/user-8.jpg')}
                                                                        className="rounded-circle mr-20 "
                                                                        alt="user profile"
                                                                        width="70"
                                                                        height="70"
                                                                    />
                                                                    <div className="media-body pt-10"
                                                                         style={{marginLeft: "1vw"}}>
                                                                        <span
                                                                            className="mb-5 text-primary fs-14 d-block">John Doe</span>
                                                                        <br/>
                                                                        <h4 className="mb-5">Event Name&nbsp;&nbsp;
                                                                            <Badge color="primary">Public</Badge>
                                                                        </h4>
                                                                        <span
                                                                            className="text-muted fs-14 mb-15 d-block">
                                                                                <i className="zmdi zmdi-time mr-5"></i>Event Date ,Event Time
                                                                            </span>
                                                                        <span
                                                                            className="text-muted fs-14 mb-15 d-block">
                                                                                 <i className="zmdi zmdi-pin mr-5"></i>Event Adress , Event zipCode
                                                                           </span>
                                                                        <span
                                                                            className="text-muted fs-14 mb-15 d-block">Number of places:&nbsp;&nbsp;
                                                                            <span
                                                                                className={`badge-secondary  badge-pill`}>15</span>
                                                                            </span>
                                                                        <span
                                                                            className="text-muted fs-14 mb-15 d-block">Number of participants :&nbsp;&nbsp;
                                                                            <span
                                                                                className={`badge-secondary  badge-pill`}>5</span>
                                                                            </span>
                                                                        <Button variant="raised"
                                                                                className="btn-warning text-white btn-icon mr-10 mb-10">
                                                                            Details
                                                                        </Button>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </Fragment>
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                </TabContainer>
                                }
                                {activeTab === 1 &&
                                <TabContainer>

                                </TabContainer>
                                }
                                {activeTab === 2 &&
                                <TabContainer>

                                </TabContainer>
                                }
                            </div>
                            <div className="col-sm-12 col-md-3 col-lg-3 w-xs-full" style={{marginTop:"4.8vw"}}>
                                <div>
                                    {this.state.adExistRight===0  ?
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
                                            <Button onClick={() => this.togglePhotoModalRight()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large"
                                                    style={{marginTop:"10px"}} >Add Advertisement</Button>
                                        </div>
                                        :
                                        <div>
                                            {this.state.userClickToChangeImgRight===0 ?
                                                <img
                                                    style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                    src={UrlPhoto.urlphoto + this.state.adPhotoRight}
                                                    alt="session-slider"
                                                    className="img-fluid"
                                                    width="377"
                                                    height="588"
                                                />
                                                : this.state.userClickToChangeImgRight===1 ?
                                                    this.state.photoUploadedSuccRight===0 ?
                                                        <img
                                                            style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                            src={this.state.photoUploadedRight}
                                                            alt="session-slider"
                                                            className="img-fluid"
                                                            width="377"
                                                            height="588"
                                                        />
                                                        :
                                                        <img
                                                            style={{display: "block", marginLeft: "auto",marginRight: "auto" }}
                                                            src={this.state.photoRight}
                                                            alt="session-slider"
                                                            className="img-fluid"
                                                            width="377"
                                                            height="588"
                                                        />
                                                    :''
                                            }
                                            <Button onClick={() => this.editAdRight()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large"   style={{marginTop:"10px"}}>Edit Advertisement</Button>{' '}
                                            <Button onClick={() => this.deleteAdRight()}
                                                    variant="raised"
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    size="large">Delete Advertisement</Button>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </RctCard>
                </div>

                {/*******************************************************************************************************************/}
                <Modal isOpen={this.state.photoModalLeft} toggle={() => this.togglePhotoModalLeft()} className={this.props.className}>
                    <ModalHeader toggle={() => this.togglePhotoModalLeft()} style={{color:"#5d92f4"}}>
                        {
                            this.state.editAdLeft === 0 ?
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
                                        value={this.state.adUrlLeft}
                                        onChange={(e) => this.setState({adUrlLeft: e.target.value})}
                                    />
                                </FormGroup>
                                <input type="file" name="file" accept="image/*" onChange={this.handleImgChangeLeft}/>
                            </Form>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.editAdLeft === 0 ?
                                <Button variant="raised" className="primary" onClick={() => this.uploadLeft()} disabled={!isEnabledLeft}>Save</Button>
                                :
                                <Button variant="raised" className="primary" onClick={() => this.updateAdLeft()} >Update</Button>
                        }
                    </ModalFooter>
                </Modal>

                {/*************************************************************************************************/}
                <Modal isOpen={this.state.photoModalRight} toggle={() => this.togglePhotoModalRight()} className={this.props.className}>
                    <ModalHeader toggle={() => this.togglePhotoModalRight()} style={{color:"#5d92f4"}}>
                        {
                            this.state.editAdright === 0 ?
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
                                        value={this.state.adUrlRight}
                                        onChange={(e) => this.setState({adUrlRight: e.target.value})}
                                    />
                                </FormGroup>
                                <input type="file" name="file" accept="image/*" onChange={this.handleImgChangeRight}/>
                            </Form>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {
                            this.state.editAdRight === 0 ?
                                <Button variant="raised" className="primary" onClick={() => this.uploadRight()} disabled={!isEnabledRight}>Save</Button>
                                :
                                <Button variant="raised" className="primary" onClick={() => this.updateAdRight()} >Update</Button>
                        }
                    </ModalFooter>
                </Modal>
            </div>

        );
    }
}

