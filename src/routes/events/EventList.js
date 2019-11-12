/**
 * Shop List
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';


// api
import api from 'Api';
import UrlPhoto from "Constants/UrlPhoto";

import {getToken} from "../../container/Shared";
import {Badge, Card, CardBody, Table} from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";
import RctCollapsibleCard from "Components/RctCollapsibleCard/RctCollapsibleCard";
import IconButton from "@material-ui/core/IconButton";
import StarRatingComponent from "react-star-rating-component";

const headers={'Content-Type': 'application/json','Authorization':'Bearer'+' '+getToken()}

class EventList extends Component {

    state = {
    }
    /************************************************************************************************************************************/
    render() {
        const {data,currentUser}=this.props;
        let eventOfCurrentUser=false;
        if(currentUser=== data.user.id)
             eventOfCurrentUser=true;
     
        return (
                <div className="post-info" style={{background:"#f6f7f8"}} >
                    <br/>
                    {eventOfCurrentUser ?
                    <div className="d-flex" style={{float:"right"}}>
                        <Tooltip id="tooltip-fab" title="Edit" placement="top">
                            <Button className="btn-warning text-white m-5" variant="fab" mini onClick={(e) => this.props.onEditEvent(data)}>
                                <i className="zmdi zmdi-edit"></i>
                            </Button>
                        </Tooltip>
                        {this.state.updateEventModal===true ?   <UpdateEvent updateEventModal={this.state.updateEventModal}/> : ''}
                        <Tooltip id="tooltip-fab" title="Delete" placement="top">
                            <Button className="btn-danger text-white m-5" variant="fab" mini onClick={(e) => this.props.onDeleteEvent(data.id)}>
                                <i className="zmdi zmdi-delete"></i>
                            </Button>
                        </Tooltip>
                        <br/>
                        <br/>
                    </div> : ''}
                    <div className="media align-items-center w-50">
                        <div className="media-left position-relative mr-10">
                           &nbsp;&nbsp; <img src={UrlPhoto.urlphoto+data.user.photo} className="img-fluid rounded-circle" alt="user profile" width="40" height="40" />
                        </div>
                        <div className="media-body pt-0">
                            <h3>{data.name}&nbsp;&nbsp;   {data.type === "Public" ? <Badge  color="primary" >Public</Badge>: <Badge  color="warning">Private</Badge>} </h3>
                            <StarRatingComponent style={{float:"right"}}
                                                 name="rate2"
                                                 editing={false}
                                                 starCount={5}
                                                 value={data.ratings}
                                                 renderStarIcon={() => <i className="zmdi zmdi-star"></i>}
                                                 renderStarIconHalf={() => <i className="zmdi zmdi-star-half"></i>}
                            />
                        </div>
                    </div>
                    <hr/>
                    <CardBody>
                        <div className="meta-info  mb-5">
                            <span className="mr-15 d-inline-block" ><i className="zmdi zmdi-time mr-5"></i>{data.plannedDate} , {data.plannedTime}</span>
                            <span className="mr-15 d-inline-block"><i className="zmdi zmdi-pin mr-5"></i>{data.adresse},{data.zipCode} </span>
                        </div>

                        <div className="meta-info mb-5">
                            Number of places:&nbsp;&nbsp;
                            {data.numberOfAvailablePlaces=== -1  ?  <span className={`badge-secondary  badge-pill`}>Unlimited</span>:
                                <span className={`badge-secondary  badge-pill`}>{data.numberOfAvailablePlaces}</span>
                            }
                            &nbsp;&nbsp;Number of participants :&nbsp;&nbsp;
                            <span className={`badge-secondary  badge-pill`}>{data.numberOfParticipants}</span>
                        </div>

                        <br/>
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
                                    {data.gamesAndCategorie && data.gamesAndCategorie.map((categorieOfGame,index) =>(
                                        <tr key={index}>
                                            <td>
                                                {categorieOfGame.categorieName}
                                            </td>
                                            <td>
                                                <div>
                                                    {categorieOfGame.games && categorieOfGame.games.map((game,key) =>(
                                                        <li className="list-group-item"  key={key}>
                                                            {game.name}
                                                            <IconButton className="text-danger" aria-label="Delete"  onClick={() => this.props.deleteGameFromEvent(game.name,data.id)}><i className="zmdi zmdi-delete"></i></IconButton>

                                                        </li>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>
                        </RctCollapsibleCard>
                        <br/>
                    </CardBody>
                </div>

        );
    }
}

export default EventList;





