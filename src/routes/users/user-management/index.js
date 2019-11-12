/**
 * User Management Page
 */
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import {Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter, Badge,Input,InputGroup, InputGroupAddon,Label,FormGroup,Col} from 'reactstrap';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { NotificationManager } from 'react-notifications';
import IconButton from "@material-ui/core/IconButton";
import { Link } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import Tooltip from '@material-ui/core/Tooltip';
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';

import RctSectionLoader from 'Components/RctSectionLoader/RctSectionLoader';
import {getToken} from "../../../container/Shared";
import classnames from "classnames";
import api from 'Api';
import UrlPhoto from "Constants/UrlPhoto";
import AddNewUserForm from './AddNewUserForm';
import UpdateUserForm from './UpdateUserForm';


const headers={'Content-Type': 'application/json','Authorization':'Bearer '+getToken()}
export default class UserProfile extends Component {

	state = {
		all: false,

		user:null,
		 // selected user to perform operations

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
		selectedUsers: 0,



		selectedUser: null,
		users: [],
		indexOfSeletedUser:null,
		loading: false, // loading activity
		page:1,
        pagesNumber:[],
        numberOfItemsPerPage:5,
        sliced:[],
		searchValue:'',
		accountType:'-1',  // 0 for free 1 for premium
		accountStatus:'-1',
		playerLevel:'-1',
	}
	/***************************************************************************************************/
	getUsers()
	{
		this.setState({ loading: true });
    	api.get('getUsers', {headers:headers})
        .then((response)=>{ this.setState({ users: response.data.list },()=>{this.pagination(),this.setState({loading: false}) });})
		.catch(error =>{NotificationManager.error('',<IntlMessages id="button.error"/>)})
	}
	/***************************************************************************************************/
	componentDidMount()
	{
		this.getUsers();
	}
	/***************************************************************************************************/
    pagination()
    {
        this.slicer(1);
        for (var i = 0; i < this.state.users.length/this.state.numberOfItemsPerPage; i++) {
            this.state.pagesNumber.push(i+1)
        }
        this.setState({pagesNumber:this.state.pagesNumber})
    }
    /***************************************************************************************************/
    slicer(page)
    {
        this.state.sliced= this.state.users.slice((page-1)*this.state.numberOfItemsPerPage,page*this.state.numberOfItemsPerPage)
        this.setState({sliced:this.state.sliced})
    }
    /***************************************************************************************************/
	onDelete(data,index) {
		this.refs.deleteConfirmationDialog.open();
		this.setState({ selectedUser: data,indexOfSeletedUser:index });
	}
	/************************************************n*********b*****************************************/
	deleteUserPermanently() {
		const { selectedUser,indexOfSeletedUser } = this.state;
		let users = this.state.users;
		users.splice(indexOfSeletedUser, 1);
		this.refs.deleteConfirmationDialog.close();
		this.setState({ loading: true });
		api.get('deleteUser/'+selectedUser.id, {headers:headers})
			.then((response)=>{
								if(response.data.result==="1")
								{
									setTimeout(() => {
										this.setState({ loading: false, users, selectedUser: null,indexOfSeletedUser:null },()=>{
											this.pagination();
										});
										NotificationManager.success('User Deleted!');
		                            }, 2000);
								}
			                 })
			.catch(error =>{ NotificationManager.error('','Error');})
	}
	/***************************************************************************************************/
	onBlock(user,index,accountStatus,badgeClass)
	{
		let users = this.state.users;
		if(accountStatus===2)
			this.refs.blockConfirmationDialog.open();
		else
			this.refs.unblockConfirmationDialog.open();
		this.setState({ selectedUser: user,indexOfSeletedUser:index },()=>{
			this.setState({selectedUser: {...this.state.selectedUser,accountStatus:accountStatus,badgeClass:badgeClass}},()=>
			{
				users[this.state.indexOfSeletedUser]=this.state.selectedUser;
			})
		});
	}
	/***************************************************************************************************/
	blockUserPermanently()
	{
		let users = this.state.users;
		this.refs.blockConfirmationDialog.close();
		this.setState({ loading: true });
		api.get('blockUser/'+this.state.selectedUser.id, {headers:headers})
			.then((response)=>{
								if(response.data.result==="1")
								{
									setTimeout(() => {
										this.setState({users, loading: false, selectedUser: null,indexOfSeletedUser:null },()=>{
											this.pagination()
										});
										}, 2000);
									NotificationManager.success('User Blocked!');
								}
							})
			.catch(error =>{ NotificationManager.error('','Error');})
	}
	/***************************************************************************************************/
	unBlockUserPermanently()
	{
		let users = this.state.users;
		this.refs.unblockConfirmationDialog.close();
		this.setState({ loading: true });
		api.get('unBlockUser/'+this.state.selectedUser.id, {headers:headers})
			.then((response)=>{
				if(response.data.result==="1")
				{
					setTimeout(() => {
						this.setState({users, loading: false, selectedUser: null,indexOfSeletedUser:null },()=>{
							this.pagination()
						});
					}, 2000);
					NotificationManager.success('User Unblocked!');
				}
			})
			.catch(error =>{ NotificationManager.error('','Error');})
	}
	/***************************************************************************************************/
	searchForUsers()
	{
		api.post(
			'searchForUsers',
			{
				keyWorld:this.state.searchValue,
				accountType:this.state.accountType,
				accountStatus:this.state.accountStatus,
				playerLevel:this.state.playerLevel,
			},
			{headers:headers}
		)
			.then((response)=>
			{
				if(response.data.result==="0")
					NotificationManager.error('',<IntlMessages id="components.loginError"/>);
				else
				{
					if(response.data.result===null)
					{
						console.log("no result")
					}
					else
					{
						this.setState({ users: response.data.result,sliced:[],pagesNumber:[] },()=>{this.pagination(),this.setState({loading: false}) });
					}
				}
			})
	}
	/***************************************************************************************************/





	opnAddNewUserModal() {
		this.setState({ addNewUserModal: true });
	}


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


	onChangeAddNewUserDetails(key, value) {
		this.setState({
			addNewUserDetail: {
				...this.state.addNewUserDetail,
				[key]: value
			}
		});
	}
	/***************************************************************************************************/
	viewUserDetail(data) {
		this.setState({ openViewUserDialog: true, selectedUser: data });
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
	/***************************************************************************************************/


	render() {
		const { users, loading, selectedUser, editUser, allSelected, selectedUsers,searchValue } = this.state;
		var selected=(this.state.accountType=== '0')? 'selected':'';
		var selected2=(this.state.accountType=== '1')? 'selected':'';
		var selected3=(this.state.accountType=== '-1')? 'selected':'';

		var selected4=(this.state.accountStatus=== '-1')? 'selected':'';
		var selected5=(this.state.accountStatus=== '0')? 'selected':'';
		var selected6=(this.state.accountStatus=== '1')? 'selected':'';


		var selected7=(this.state.playerLevel=== '-1')? 'selected':'';
		var selected8=(this.state.playerLevel=== '0')? 'selected':'';
		var selected9=(this.state.playerLevel=== '1')? 'selected':'';
		var selected10=(this.state.playerLevel=== '2')? 'selected':'';
// console.log("accountType: " +this.state.accountType)
// 		console.log("accountStatus: " +this.state.accountStatus)
//
// 		console.log("playeLevel: " +this.state.playerLevel)

		return (
			<div className="user-management">
				<Helmet>
					<title>Reactify | Users Management</title>
					<meta name="description" content="Reactify Widgets" />
				</Helmet>
				<h1><IntlMessages id="sidebar.userManagement"/></h1>
				<br/>
				<RctCollapsibleCard fullBlock>
					<div className="table-responsive">

						<div className={classnames("card-base", { 'border-primary':true})}>
							<div className="d-flex justify-content-between">
								<h3 className="fw-bold">{users.length}&nbsp;&nbsp;<IntlMessages id="sidebar.users" /></h3>
							</div>
						</div>

						<div className="d-flex justify-content-between py-30 px-70 ">
							<InputGroup >
								<InputGroupAddon addonType="prepend" >
									<IconButton aria-label="facebook">
										<i className="zmdi zmdi-search"></i>
									</IconButton>
								</InputGroupAddon>
								<Input placeholder="Search" type="text" name="searchValue" value={searchValue}  onChange={(e) => this.setState({searchValue:e.target.value})}/>
							</InputGroup>

						</div>
						<div className="d-flex justify-content-between py-0 px-60 ">
							<FormGroup>
								<Input type="select" name="accountType" onChange={(e) => this.setState({accountType: e.target.value})}>
									<option selected={selected3} value="-1" >Choose Account Type</option>
									<option selected={selected} value="0" >Free</option>
									<option selected={selected2} value="1">Premium </option>
								</Input>
							</FormGroup>

							<FormGroup>
								<Input type="select" name="accountStatus" onChange={(e) => this.setState({accountStatus: e.target.value})}>
									<option selected={selected4} value="-1" >Choose Account Status</option>
									<option selected={selected5} value="1" >Active</option>
									<option selected={selected6} value="2">Blocked</option>
								</Input>
							</FormGroup>

							<FormGroup>
								<Input type="select" name="playerLevel" onChange={(e) => this.setState({playerLevel: e.target.value})}>
									<option selected={selected7} value="-1" >Choose Player level</option>
									<option selected={selected8} value="0" >Amateur</option>
									<option selected={selected9} value="1">Debutant</option>
									<option selected={selected10} value="2" >Professionnel</option>
								</Input>
							</FormGroup>
							<div>
								<Button
									color="primary"
									className="btn-block text-white mr-70"
									variant="raised"
									size="large"
									onClick={() => this.searchForUsers()}
								>
									Search
								</Button>
							</div>

						</div>
						<div className="d-flex justify-content-between py-20 px-60 ">
							<div>
							</div>

						</div>
						<table className="table table-middle table-hover mb-0">
							<thead>
								<tr>
									<th>Nickname</th>
									<th>Email Address</th>
									<th>Account Status</th>
									<th>Membership Plan</th>
									<th>Account Created At</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{users && this.state.sliced.map((user, key) => (
									<tr key={key}>
										<td>
											<div className="media">
												<img src={UrlPhoto.urlphoto+user.photo} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
												<div className="media-body">
													<h5 className="mb-5 fw-bold">{user.name}</h5>
													{
														 user.playerLevel === 0 ? <Badge color="warning">amateur</Badge>:
														 user.playerLevel === 1 ?  <Badge color="info">debutant</Badge>:
														 user.playerLevel === 2 ?  <Badge color="success">professionel</Badge>:''
													}
												</div>
											</div>
										</td>
										<td>{user.email}</td>
										<td>
											<div className="row">
												<span className={`badge badge-xs ${user.badgeClass} mr-10 mt-10 position-relative`}>&nbsp;</span>
												{
													user.accountStatus === 1 ? <span className="d-block">Active</span>:
													<span className="d-block">Blocked</span>
												}
											</div>
										</td>
										<td>
											{
												user.accountType === 0 ?  <span className={`badge-info  badge-pill`}>Free</span>:
												<span className={`badge-secondary  badge-pill`}>Premium</span>
											}

										</td>
										<td>{user.email_verified_at}</td>
										<td className="list-action">
								        	<Tooltip title="View" placement="bottom">
                            					<a onClick={() => this.viewUserDetail(user)}><i className="ti-eye"></i></a>
                            				</Tooltip>
											<Tooltip title="Edit" placement="bottom">
												<a  onClick={() => this.onEditUser(user)}><i className="ti-pencil"></i></a>
                            				</Tooltip>

												{user.accountStatus === 1 ?
													<Tooltip title="Block" placement="bottom">
														<a onClick={() => this.onBlock(user, key,2,"badge-danger")}>
															<i className="zmdi zmdi-block"></i>
														</a>
													</Tooltip>
													:
													<Tooltip title="Unblock" placement="bottom">
														<a onClick={() => this.onBlock(user, key,1,"badge-success")}>
															<i className="zmdi zmdi-spinner"></i>
														</a>
													</Tooltip>
												}

                            				<Tooltip title="Delete" placement="bottom">
                            					<a  onClick={() => this.onDelete(user,key)}><i className="ti-close"></i></a>
                            				</Tooltip>
										</td>
									</tr>
								))}
							</tbody>
							<tfoot className="border-top">
								<tr>
									<td colSpan="100%">
										<Pagination className="mb-0 py-10 px-10">
											{ this.state.pagesNumber.map(n=>
												<PaginationItem >
													<PaginationLink href="javascript:void(0)" onClick={()=>this.slicer(n)}>{n}</PaginationLink>
												</PaginationItem>
											)}
										</Pagination>
									</td>
								</tr>
							</tfoot>
						</table>
					</div>
					{loading && <RctSectionLoader />}
				</RctCollapsibleCard>

				<DeleteConfirmationDialog
					ref="deleteConfirmationDialog"
					title="Are You Sure Want To Delete?"
					message="This will delete user definitely."
					onConfirm={() => this.deleteUserPermanently()}
				/>

				<DeleteConfirmationDialog
					ref="blockConfirmationDialog"
					title="Are You Sure Want To Block user acccount ?"
					onConfirm={() => this.blockUserPermanently()}
				/>

				<DeleteConfirmationDialog
					ref="unblockConfirmationDialog"
					title="Are You Sure Want To unblock user acccount ?"
					onConfirm={() => this.unBlockUserPermanently()}
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
						{selectedUser !== null &&
							<div>
								<div className="clearfix d-flex">
									<div className="media pull-left">
										<img src={UrlPhoto.urlphoto+selectedUser.photo} alt="user prof" className="rounded-circle mr-15" width="50" height="50" />
										<div className="media-body">
											<p>Nickname&nbsp;:&nbsp; <span className="fw-bold">{selectedUser.name}</span></p>
											<p>Age&nbsp;:&nbsp;<span className="fw-bold">{selectedUser.age}</span></p>
											<p>Gender&nbsp;:&nbsp; <span className="fw-bold">{selectedUser.sexe}</span></p>
											<p>Email Address&nbsp;:&nbsp; <span className="fw-bold">{selectedUser.email}</span></p>
											<p>Zip Code &nbsp;:&nbsp; <span className="fw-bold">{selectedUser.zipCode}</span></p>
											<p>Presentation&nbsp;:&nbsp; <span className="fw-bold">{selectedUser.presentation}</span></p>
											<p>Account Status&nbsp;:&nbsp;
											{selectedUser.accountStatus === 1 ? 
												    <Badge className="mb-10 mr-10" color="success"> <span className="fw-bold">Active</span></Badge>:
              										<Badge className="mb-10 mr-10" color="danger"> <span className="fw-bold">Blocked</span></Badge>
											}
											</p>
											<p>Membership Plan&nbsp;:&nbsp;
												{selectedUser.accountType === 0 ?  <span className={`badge-info  badge-pill`}> Free</span>:
													<span className={`badge-secondary  badge-pill`}> Premium</span>
												}
											</p>
											<p>Player Level&nbsp;:&nbsp;
												{selectedUser.playerLevel === 0 ? <Badge color="warning"> <span className="fw-bold">amateur</span></Badge>:
													selectedUser.playerLevel === 1 ?  <Badge color="info"> <span className="fw-bold">debutant</span></Badge>:
														selectedUser.playerLevel === 2 ?  <Badge color="success"> <span className="fw-bold">professionel</span></Badge>:''
												}
											</p>
											<p>Account Created At&nbsp;:&nbsp; <span className="fw-bold"> {selectedUser.email_verified_at}</span></p>
											<hr/>
											<Link to={{pathname: '/app/users/user-detail'}}>
												<i className="zmdi zmdi-plus-circle text-primary mr-3"></i>
												<IntlMessages id="button.viewProfile" />
											</Link>
											
										</div>

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
