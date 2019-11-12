
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from 'Routes/ads/signIn';
import SignUp from "Routes/ads/signUp";
import Home from "Routes/ads/home";
import Event from "Routes/ads/events";
const Forms = ({ match }) => (
    <div className="content-wrapper">
        <Switch>
            <Route path={`${match.url}/signIn`} component={SignIn} />
            <Route path={`${match.url}/signUp`} component={SignUp} />
            <Route path={`${match.url}/home`} component={Home} />
            <Route path={`${match.url}/myEvents`} component={Event} />
        </Switch>
    </div>
);

export default Forms;
