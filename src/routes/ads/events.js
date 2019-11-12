
import React, {Component, Fragment,} from 'react';
import Button from '@material-ui/core/Button';
import Card from 'react-bootstrap/Card'
import {Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Collapse, Badge,Label, Table} from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import IntlMessages from "Util/IntlMessages";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import IconButton from "@material-ui/core/IconButton";
import './ads.css';
import {getToken} from "../../container/Shared";
import api from 'Api';
import UrlPhoto from "Constants/UrlPhoto";

const headers={'Content-Type': 'application/json','Authorization':'Bearer '+getToken()}


export default class Event extends Component{

//location of ad for events right side is 7 , home left side is 6
    /****************************************************************************************************************************************/
    constructor(props)
    {
        super(props)
        this.state = {
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
        api.get('getAd/6', {headers:headers})
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
        api.get('getAd/7', {headers:headers})
            .then((response)=>{
                if(response.data.result==='-1')  //there is an ad for singin page
                    this.setState({loading:0})
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
                    adLocation:6
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
                    adLocation:7
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
                adLocation:6  //0 for signIn page
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
                adLocation:7  //0 for signIn page
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
        api.get('deleteAd/6', {headers:headers})
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
        api.get('deleteAd/7', {headers:headers})
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
        return (
            <div className="user-management" >
                <h1><IntlMessages id="widgets.myEventsAdManagement"/></h1>
                <br/>
                <div className="profile-body">
                    <div className="row">
                        <div className="col-sm-12 col-md-3 col-lg-3 w-xs-full">
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
                            <Card >
                                <Card.Body>
                                    <Card.Text>
                                        <div >
                                            <Button variant="raised" color="primary" className="text-white btn-lg mb-20">Create Event</Button>
                                        </div>
                                        <div style={{background:"#f6f7f8",padding:20}} >
                                            <Form>
                                                <FormGroup>
                                                    <Label for="name" style={{size:"50"}}>Name</Label>
                                                    <Input name="eventName" id="name"/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <div className="form-inline" style={{padding:"5"}}>
                                                        <FormGroup>
                                                            <Label for="location">Where&nbsp;&nbsp;</Label>
                                                            <Input name="location" id="location"/>
                                                        </FormGroup>
                                                        <FormGroup>
                                                            <Label for="location">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Label>
                                                            <Input type="text" name="zipCode" placeholder="zip code"/>
                                                        </FormGroup>
                                                    </div>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label for="type">Privacy</Label>
                                                    <Input type="select" name="eventType" id="type">
                                                        <option disabled>Public</option>
                                                        <option selected disabled>Private</option>
                                                    </Input>
                                                </FormGroup>

                                                <FormGroup>
                                                    <div className="form-inline" >
                                                        <FormGroup style={{width: "50%"}}>
                                                            <Label for="date">Date&nbsp;&nbsp;&nbsp;</Label>
                                                            <Input name="eventDate" id="date"/>
                                                        </FormGroup>
                                                        <FormGroup style={{width: "50%"}}>
                                                            <Label for="time">&nbsp;Time&nbsp;&nbsp;&nbsp;</Label>
                                                            <Input name="eventTime" id="time"/>
                                                        </FormGroup>
                                                    </div>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Label>Number of places  </Label>
                                                    <div className="form-inline"   style={{marginLeft: "4vw"}}>
                                                        <FormGroup  style={{width:"50%"}}>
                                                            <Label for="limited">
                                                                <Input type="radio" name="numberOfAvailablePlaces"  id="limited" />Limited
                                                            </Label>
                                                        </FormGroup>
                                                        <FormGroup  style={{width:"50%"}}>
                                                            <Label for="notLimited">
                                                                <Input type="radio" name="numberOfAvailablePlaces" value="notLimited" id="notLimited" />Not Limited
                                                                </Label>
                                                        </FormGroup>
                                                    </div>
                                                </FormGroup>
                                                <FormGroup >
                                                    <Input  name="numberOfAvailablePlaces" id="numberOfPlaces" placeholder="Saisir le nombre de places"/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button variant="raised"  className="text-white  btn-warning ">Add games to the event</Button>
                                                </FormGroup>
                                            </Form>
                                        </div>
                                        <br/>
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
                                                            <div>
                                                                <RctCollapsibleCard heading="Event Games">
                                                                    <div className="table-responsive">
                                                                        <Table hover bordered>
                                                                            <thead>
                                                                            <tr className="bg-primary text-white">
                                                                                <th>Game's type</th>
                                                                                <th>Game's name</th>
                                                                            </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                            <tr>
                                                                                <td>Jeux de plateau</td>
                                                                                <td>
                                                                                    <div>
                                                                                        <li className="list-group-item">suduku
                                                                                            <IconButton className="text-danger " aria-label="Delete">
                                                                                                <i className="zmdi zmdi-delete"></i>
                                                                                            </IconButton>
                                                                                        </li>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>
                                                                </RctCollapsibleCard>
                                                                <Button variant="raised" className="btn-warning text-white btn-icon mr-10 mb-10">
                                                                    Edit
                                                                </Button>
                                                                <Button variant="raised" className="btn-danger text-white btn-icon mr-10 mb-10">
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </Fragment>
                                    </Card.Text>

                                </Card.Body>
                            </Card>

                        </div>
                        <div className="col-sm-12 col-md-3 col-lg-3 w-xs-full">
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

