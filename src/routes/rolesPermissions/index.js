/**
 * Users Routes
 */
/* eslint-disable */
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// async components
import { AsyncRoleManagementComponent,AsyncPermissionManagementComponent} from 'Components/AsyncComponent/AsyncComponent';

const Forms = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
            <Route path={`${match.url}/roles`} component={AsyncRoleManagementComponent} />
            <Route path={`${match.url}/permissions`} component={AsyncPermissionManagementComponent} />
        </Switch>
    </div>
);

export default Forms;
