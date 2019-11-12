
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
export default class AdsManagement extends Component { 

    state = {
        loading: false,
    }
    /***************************************************************************************************/

    /***************************************************************************************************/

    /***************************************************************************************************/
    /*************************************************************************************************/

    /***************************************************************************************************/

    /***************************************************************************************************/

    /***************************************************************************************************/


    render() {
        const { loading} = this.state;
    
        return (
            <div className="user-management">
                <Helmet>
                    <title>Reactify |Events Management</title>
                    <meta name="description" content="Reactify Widgets" />
                </Helmet>
                <PageTitleBar
                    title={<IntlMessages id="sidebar.permissions" />}
                    match={this.props.match}
                />
                 <div className="video-player-wrapper">
          
            <div className="row">
               <RctCollapsibleCard
                  colClasses="col-sm-12 col-md-12 col-lg-6"
                  heading={<IntlMessages id="widgets.baseConfig" />}
               >
                  
               </RctCollapsibleCard>



               <RctCollapsibleCard
                  colClasses="col-sm-12 col-md-12 col-lg-6"
                  heading={<IntlMessages id="widgets.withDownloadButton" />}
               >
                  
                
               </RctCollapsibleCard>


               <RctCollapsibleCard
                  colClasses="col-sm-12 col-md-12 col-lg-6"
                  heading={<IntlMessages id="widgets.customControlBar" />}
               >
                  
               </RctCollapsibleCard>



               <RctCollapsibleCard
                  colClasses="col-sm-12 col-md-12 col-lg-6"
                  heading={<IntlMessages id="widgets.httpLiveStreaming" />}
               >
                


               </RctCollapsibleCard>
               <RctCollapsibleCard
                  colClasses="col-sm-12 col-md-12 col-lg-12"
                  heading={<IntlMessages id="widgets.keyboardShortcuts" />}
               >
                  <div className="table-responsive">
                     <table className="table table-hover mb-0">
                        <thead>
                           <tr>
                              <th>Action</th>
                              <th>Shortcut</th>
                              <th>Action</th>
                              <th>Shortcut</th>
                           </tr>
                        </thead>
                        <tbody>
                          
                        </tbody>
                     </table>
                  </div>
               </RctCollapsibleCard>
            </div>
         </div>
                <RctCollapsibleCard fullBlock>
                    <div className="table-responsive">
                        <div className="d-flex justify-content-between py-20 px-10 border-bottom">
                         
                        </div>




                    
                    </div>
                    {loading &&
                    <RctSectionLoader />
                    }
                </RctCollapsibleCard>
                
                

               
                   
                
            </div>
        );
    }
}
