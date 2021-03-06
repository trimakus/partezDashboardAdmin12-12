/**
 * App Header
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import screenfull from 'screenfull';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';
import $ from 'jquery';

// actions
import { collapsedSidebarAction } from 'Actions';

// helpers
import { getAppLayout } from "Helpers/helpers";

// components
import Notifications from './Notifications';
import ChatSidebar from './ChatSidebar';
import DashboardOverlay from '../DashboardOverlay/DashboardOverlay';
import LanguageProvider from './LanguageProvider';
import SearchForm from './SearchForm';
import QuickLinks from './QuickLinks';
import MobileSearchForm from './MobileSearchForm';
import Cart from './Cart';

// intl messages
import IntlMessages from 'Util/IntlMessages';
import {destroyToken} from "../../container/Shared";
import api from "Api/index";
import {NotificationManager} from "react-notifications";

class Header extends Component {

    state = {
        customizer: false,
        isMobileSearchFormVisible: false
    }

    /************************************************************************************************************************************/
    onToggleNavCollapsed = (event) => {
        const val = !this.props.navCollapsed;
        this.props.collapsedSidebarAction(val);
    }

    /************************************************************************************************************************************/
    openDashboardOverlay() {
        $('.dashboard-overlay').toggleClass('d-none');
        $('.dashboard-overlay').toggleClass('show');
        if ($('.dashboard-overlay').hasClass('show')) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', '');
        }
    }
    /************************************************************************************************************************************/

    closeDashboardOverlay() {
        $('.dashboard-overlay').removeClass('show');
        $('.dashboard-overlay').addClass('d-none');
        $('body').css('overflow', '');
    }
    /************************************************************************************************************************************/
    // mobile search form
    openMobileSearchForm() {
        this.setState({ isMobileSearchFormVisible: true });
    }
    /************************************************************************************************************************************/
    logoutUser()
    {
        destroyToken()
    }
    /************************************************************************************************************************************/
    render() {
        const { isMobileSearchFormVisible } = this.state;
        $('body').click(function () {
            $('.dashboard-overlay').removeClass('show');
            $('.dashboard-overlay').addClass('d-none');
            $('body').css('overflow', '');
        });
        const { horizontalMenu, agencyMenu, location } = this.props;
        return (
            <AppBar position="static" className="rct-header">
                <Toolbar className="d-flex justify-content-between w-100 pl-0" style={{marginTop:"1.7vw"}}>
                    <div className="d-flex align-items-center">
                        {!agencyMenu &&
                        <ul className="list-inline mb-0 navbar-left">
                            {!horizontalMenu ?
                                <li className="list-inline-item" onClick={(e) => this.onToggleNavCollapsed(e)}>
                                    <Tooltip title="Sidebar Toggle" placement="bottom">
                                        <IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
                                            <MenuIcon />
                                        </IconButton>
                                    </Tooltip>
                                </li> :
                                <li className="list-inline-item">
                                    <Tooltip title="Sidebar Toggle" placement="bottom">
                                        <IconButton color="inherit" aria-label="Menu" className="humburger p-0" component={Link} to="/">
                                            <i className="ti-layout-sidebar-left"></i>
                                        </IconButton>
                                    </Tooltip>
                                </li>
                            }
                            {!horizontalMenu }
                            <li className="list-inline-item search-icon d-inline-block"  style={{visibility: "hidden"}}>
                                <SearchForm />
                                <IconButton mini="true" className="search-icon-btn" onClick={() => this.openMobileSearchForm()}>
                                    <i className="zmdi zmdi-search"></i>
                                </IconButton>
                                <MobileSearchForm
                                    isOpen={isMobileSearchFormVisible}
                                    onClose={() => this.setState({ isMobileSearchFormVisible: false })}
                                />
                            </li>
                        </ul>
                        }
                    </div>
                    <ul className="navbar-right list-inline mb-0">
                        <li className="list-inline-item summary-icon"  style={{display: "none"}}>
                            <Tooltip title="Summary" placement="bottom">
                                <a href="javascript:void(0)" className="header-icon tour-step-3">
                                    <i className="zmdi zmdi-info-outline"></i>
                                </a>
                            </Tooltip>
                        </li>
                        {!horizontalMenu &&
                        <li className="list-inline-item" style={{display: "none"}}>
                            <Tooltip title="Upgrade" placement="bottom">
                                <Button component={Link} to={`/${getAppLayout(location)}/pages/pricing`} variant="raised" className="upgrade-btn tour-step-4 text-white" color="primary">
                                    <IntlMessages id="widgets.upgrade" />
                                </Button>
                            </Tooltip>
                        </li>
                        }
                        <LanguageProvider />
                        <Notifications />
                        <Cart style={{display: "none"}} />
                        <li className="list-inline-item setting-icon">
                            <Tooltip title="Chat" placement="bottom">
                                <IconButton aria-label="settings" onClick={() => this.setState({ customizer: true })}>
                                    <i className="zmdi zmdi-comment"></i>
                                </IconButton>
                            </Tooltip>
                        </li>
                        <li className="list-inline-item">
                            <Button  onClick={() => this.logoutUser()} variant="raised" className="upgrade-btn tour-step-4 text-white" color="primary">
                                <IntlMessages id="widgets.logOut" />
                            </Button>
                        </li>
                    </ul>
                    <Drawer
                        anchor={'right'}
                        open={this.state.customizer}
                        onClose={() => this.setState({ customizer: false })}
                    >
                        <ChatSidebar style={{display: "none"}} />
                    </Drawer>
                </Toolbar>
                <DashboardOverlay
                    onClose={() => this.closeDashboardOverlay()}
                />
            </AppBar>
        );
    }
}

// map state to props
const mapStateToProps = ({ settings }) => {
    return settings;
};

export default withRouter(connect(mapStateToProps, {
    collapsedSidebarAction
})(Header));
