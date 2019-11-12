
/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge, Col, Label
} from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { NotificationManager } from 'react-notifications';

// api
import api from 'Api';
import UrlPhoto from "Constants/UrlPhoto";
// delete confirmation dialog
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

// add new user form
import AddNewUserForm from './AddNewUserForm';

// update user form
import UpdateUserForm from './UpdateUserForm';
import EventList from './EventList';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';

// intl messages
import IntlMessages from 'Util/IntlMessages';
//import {getToken} from "../../container/Shared";
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

// rct section loader
import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import {getToken} from "../../container/Shared";
const headers={'Content-Type': 'application/json','Authorization':'Bearer'+' '+getToken()}
export default class EventManagment extends Component {

    state = {
        all: false,
        events: null, // initial user data
        event:null,
        selectedEvent: null, // selected user to perform operations
        loading: false, // loading activity
        addNewUserModal: false, // add new user form modal
        addNewUserDetail: {
            id: '',
            name: '',
            photo: '',
            type: '',
            email: '',
            status: 'Active',
            lastSeen: '',
            accountType: '',
            badgeClass: 'badge-success',
            dateCreated: 'Just Now',
            checked: false
        },
        openViewUserDialog: false, // view user dialog box
        editUser: null,
        allSelected: false,
        selectedEvents: 0
    }
    /***************************************************************************************************/
    getEvents()
    {
        api.get('getAllEvents', {headers:headers})
            .then((response)=>{this.setState({ events: response.data.list })})
            .catch(error =>{console.log(error)})

    }
    /***************************************************************************************************/
    componentDidMount()
    {
        this.getEvents();
    }
    /***************************************************************************************************/
    onDelete(data) {
        this.refs.deleteConfirmationDialog.open();
        this.setState({ selectedEvent: data });
    }
    /***************************************************************************************************/
    deleteEventPermanently() {
        const { selectedEvent } = this.state;
        this.refs.deleteConfirmationDialog.close();
        this.setState({ loading: true });
        api.get('deleteEvent/'+selectedEvent.id, {headers:headers})
            .then((response)=>{
                if(response.data.result===true)
                {
                    this.getEvents();
                    this.setState({ loading: false, selectedEvent: null });
                    NotificationManager.success('Event Deleted!');
                }
            })
            .catch(error =>{ NotificationManager.error('','Error');})
    }
    /***************************************************************************************************/


    /**
     * Open Add New User Modal
     */
    opnAddNewUserModal() {
        this.setState({ addNewUserModal: true });
    }

    /**
     * On Reload
     */
    onReload() {
        this.setState({ loading: true });
        let self = this;
        setTimeout(() => {
            self.setState({ loading: false });
        }, 2000);
    }

    /**
     * On Select User
     */
    onSelectUser(user) {
        user.checked = !user.checked;
        let selectedUsers = 0;
        let users = this.state.users.map(userData => {
            if (userData.checked) {
                selectedUsers++;
            }
            if (userData.id === user.id) {
                if (userData.checked) {
                    selectedUsers++;
                }
                return user;
            } else {
                return userData;
            }
        });
        this.setState({ users, selectedUsers });
    }

    /**
     * On Change Add New User Details
     */
    onChangeAddNewUserDetails(key, value) {
        this.setState({
            addNewUserDetail: {
                ...this.state.addNewUserDetail,
                [key]: value
            }
        });
    }

    /**
     * Add New User
     */
    addNewUser() {
        const { name, emailAddress } = this.state.addNewUserDetail;
        if (name !== '' && emailAddress !== '') {
            let users = this.state.users;
            let newUser = {
                ...this.state.addNewUserDetail,
                id: new Date().getTime()
            }
            users.push(newUser);
            this.setState({ addNewUserModal: false, loading: true });
            let self = this;
            setTimeout(() => {
                self.setState({ loading: false, users });
                NotificationManager.success('User Created!');
            }, 2000);
        }
    }
    /***************************************************************************************************/
    viewUserDetail(data) {
        this.setState({ openViewUserDialog: true, selectedEvent: data });
        //const { match, history } = this.props;
        //history.push(`${match.url}/user-detail`)
        //console.log('ggggg');
    }
    /***************************************************************************************************/
    onEditUser(user) {
        this.setState({ addNewUserModal: true, editUser: user });
    }
    /***************************************************************************************************/
    onAddUpdateUserModalClose() {
        this.setState({ addNewUserModal: false, editUser: null })
    }
    /**
     * On Update User Details
     */
    onUpdateUserDetails(key, value) {
        this.setState({
            editUser: {
                ...this.state.editUser,
                [key]: value
            }
        });
    }

    /**
     * Update User
     */
    updateUser() {
        const { editUser } = this.state;
        let indexOfUpdateUser = '';
        let users = this.state.users;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user.id === editUser.id) {
                indexOfUpdateUser = i
            }
        }
        users[indexOfUpdateUser] = editUser;
        this.setState({ loading: true, editUser: null, addNewUserModal: false });
        let self = this;
        setTimeout(() => {
            self.setState({ users, loading: false });
            NotificationManager.success('User Updated!');
        }, 2000);
    }

    //Select All user
    onSelectAllUser(e) {
        const { selectedUsers, users } = this.state;
        let selectAll = selectedUsers < users.length;
        if (selectAll) {
            let selectAllUsers = users.map(user => {
                user.checked = true
                return user
            });
            this.setState({ users: selectAllUsers, selectedUsers: selectAllUsers.length })
        } else {
            let unselectedUsers = users.map(user => {
                user.checked = false
                return user;
            });
            this.setState({ selectedUsers: 0, users: unselectedUsers });
        }
    }

    render() {
        const { events, loading, selectedEvent, editUser, allSelected, selectedEvents } = this.state;
    
        return (
            <div className="user-management">
                <Helmet>
                    <title>Reactify |Events Management</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.eventManagement" />}
                    match={this.props.match}
                />
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                            <div>
                                <a href="javascript:void(0)" onClick={() => this.onReload()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                                <a href="javascript:void(0)" className="btn-outline-default mr-10">More</a>
                            </div>
                            <div>
                                <a href="javascript:void(0)" className="btn-sm btn-outline-default mr-10">Export to Excel</a>
                                <a href="javascript:void(0)" onClick={() => this.opnAddNewUserModal()} color="primary" className="caret btn-sm mr-10">Add New Event <i className="zmdi zmdi-plus"></i></a>
                            </div>
                        </div>
                        <table className="table table-middle table-hover mb-0">
                            <thead>
                            <tr>
                                <th className="w-5">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                indeterminate={selectedEvents > 0 && selectedEvents< events.length}
                                                checked={selectedEvents > 0}
                                                onChange={(e) => this.onSelectAllUser(e)}
                                                value="all"
                                                color="primary"
                                            />
                                        }
                                        label="All"
                                    />

                                </th>
                                <th>Name & Type</th>
                                <th>Date & Time</th>
                                <th>Location</th>
                                <th>Event Creator </th>
                                <th>Number of places </th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {events && events.map((event, key) => (
                                <tr key={key}>
                                    <td>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={event.checked}
                                                    onChange={() => this.onSelectUser(event)}
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </td>
                                    <td>
                                        <div className="media-body">
                                            <h5 className="mb-5 fw-bold">{event.name}</h5>
                                            {event.type === "public" ? <Badge color="warning">Public</Badge>:
                                                event.type === "private" ?  <Badge color="success">Private</Badge>:''
                                            }
                                        </div>
                                    </td>


                                    <td>
                                        <div className="status">
                                            <span className="d-block"><i className="zmdi zmdi-calendar mr-5"></i>{event.plannedDate}</span>
                                            <span className="small"><i className="zmdi zmdi-time mr-5"></i>{event.plannedTime}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="status">
                                            <span className="d-block"><i className="zmdi zmdi-pin mr-5"></i>{event.adresse}, </span>
                                            <span className="small">{event.zipCode}</span>
                                        </div>
                                    </td>

                                    <td>
                                        <div className="media">
                                            <img src={UrlPhoto.urlphoto+event.user.photo} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
                                            <div className="media-body">
                                                <h5 className="mb-5 fw-bold">{event.user.name}</h5>
                                            </div>
                                        </div>
                                    </td>



                                    <td>
                                        {event.numberOfAvailablePlaces=== -1  ?  <span className={`badge-info  badge-pill`}>Unlimited</span>:
                                            <span className={`badge-secondary  badge-pill`}>{event.numberOfAvailablePlaces}</span>
                                        }

                                    </td>


                                    <td className="list-action">
                                        <a href="javascript:void(0)" onClick={() => this.viewUserDetail(event)}><i className="ti-eye"></i></a>
                                        <a href="javascript:void(0)" onClick={() => this.onEditUser(event)}><i className="ti-pencil"></i></a>
                                        <a href="javascript:void(0)" onClick={() => this.onDelete(event)}><i className="ti-close"></i></a>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot className="border-top">
                            <tr>
                                <td colSpan="100%">
                                    <Pagination className="mb-0 py-10 px-10">
                                        <PaginationItem>
                                            <PaginationLink previous href="#" />
                                        </PaginationItem>
                                        <PaginationItem active>
                                            <PaginationLink href="javascript:void(0)">1</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="javascript:void(0)">2</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink href="javascript:void(0)">3</PaginationLink>
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationLink next href="javascript:void(0)" />
                                        </PaginationItem>
                                    </Pagination>
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                    {loading &&
                    <RctSectionLoader />
                    }
                </RctCollapsibleCard>
                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialog"
                    title="Are You Sure Want To Delete?"
                    message="This will delete event definitely."
                    onConfirm={() => this.deleteEventPermanently()}
                />
                <Modal isOpen={this.state.addNewUserModal} toggle={() => this.onAddUpdateUserModalClose()}>
                    <ModalHeader toggle={() => this.onAddUpdateUserModalClose()}>
                        {editUser === null ?
                            'Add New User' : 'Update User'
                        }
                    </ModalHeader>
                    <ModalBody>
                        {editUser === null ?
                            <AddNewUserForm
                                addNewUserDetails={this.state.addNewUserDetail}
                                onChangeAddNewUserDetails={this.onChangeAddNewUserDetails.bind(this)}
                            />
                            : <UpdateUserForm user={editUser} onUpdateUserDetail={this.onUpdateUserDetails.bind(this)} />
                        }
                    </ModalBody>
                    <ModalFooter>
                        {editUser === null ?
                            <Button variant="raised" className="text-white btn-success" onClick={() => this.addNewUser()}>Add</Button>
                            : <Button variant="raised" color="primary" className="text-white" onClick={() => this.updateUser()}>Update</Button>
                        }
                        {' '}
                        <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateUserModalClose()}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <Dialog
                    onClose={() => this.setState({ openViewUserDialog: false })}
                    open={this.state.openViewUserDialog}
                >
                    <DialogContent>
                        {selectedEvent !== null &&
                        <div>
                            <div className="clearfix d-flex">
                                <div className="media pull-left">
                                       <EventList   data={selectedEvent}  />
                                
                                </div>
                            </div>
                        </div>
                        }
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
