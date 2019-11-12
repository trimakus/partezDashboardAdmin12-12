/**
 * User Block Component
 */
import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import SupportPage from '../Support/Support';

import IntlMessages from 'Util/IntlMessages';
import api from "Api/index";
import UrlPhoto from "Constants/UrlPhoto";
import {getToken,getCurrentUser,destroyToken} from "../../container/Shared";
class UserBlock extends Component {

	

	/*******************************************************************************************************/
	state = {
		userDropdownMenu: false,
		isSupportModal: false,
		user:null,
	}
	/************************************************************************************************************************************/
	logoutUser(){
		destroyToken()
	}
	/************************************************************************************************************************************/
	toggleUserDropdownMenu() {
		this.setState({ userDropdownMenu: !this.state.userDropdownMenu });
	}
	/************************************************************************************************************************************/
	openSupportModal() {
		this.setState({ isSupportModal: true });
	}
	/************************************************************************************************************************************/
	onCloseSupportPage() {
		this.setState({ isSupportModal: false });
	}
	/************************************************************************************************************************************/
	onSubmitSupport() {
		this.setState({ isSupportModal: false });
		NotificationManager.success('Message has been sent successfully!');
	}
	/************************************************************************************************************************************/
	render() {
		let user=JSON.parse(getCurrentUser())
		return (
			<div className="top-sidebar">
				<div className="sidebar-user-block">
					<Dropdown
						isOpen={this.state.userDropdownMenu}
						toggle={() => this.toggleUserDropdownMenu()}
						className="rct-dropdown"
					>
						<DropdownToggle
							tag="div"
							className="d-flex align-items-center"
						>
							<div className="">
								<img
									src={UrlPhoto.urlphoto +user.photo}
									alt="user profile"
									className="rounded-circle"
									width="50"
									height="50"
								/>
							</div>
							<div className="user-info">
								<span className="user-name ml-4">{user.name}</span>
								<i className="zmdi zmdi-chevron-down dropdown-icon mx-4"></i>
							</div>
						</DropdownToggle>
						<DropdownMenu  style={{width:'200vw :!important'}}>
							<ul className="list-unstyled mb-0">
								<li className="p-15 border-bottom user-profile-top bg-primary rounded-top">
									<p className="text-white mb-0 fs-14" style={{wordBreak:"break-all"}}>{user.name}</p>
								</li>
								<li>
									<Link to={{
										pathname: '/app/users/user-profile-1',
										state: { activeTab: 0 }
									}}>
										<i className="zmdi zmdi-account text-primary mr-3"></i>
										<IntlMessages id="widgets.profile" />
									</Link>
								</li>
								<li className="border-top">
									<a href="javascript:void(0)" onClick={() => this.logoutUser()}>
										<i className="zmdi zmdi-power text-danger mr-3"></i>
										<IntlMessages id="widgets.logOut" />
									</a>
								</li>
							</ul>
						</DropdownMenu>
					</Dropdown>
				</div>
				<SupportPage
					isOpen={this.state.isSupportModal}
					onCloseSupportPage={() => this.onCloseSupportPage()}
					onSubmit={() => this.onSubmitSupport()}
				/>
			</div>
		);
	}
}

export default UserBlock;
