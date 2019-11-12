/**
 * App.js Layout Start Here
 */
import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';

// rct theme provider
import RctThemeProvider from './RctThemeProvider';

import RctDefaultLayout from './DefaultLayout';
import AppSignIn from './SigninFirebase';
import AppSignUp from './SignupFirebase';
import { getToken} from './Shared';
import {
	AsyncSessionForgotPasswordComponent,
	AsyncSessionPage404Component, AsyncSessionPage500Component, AsyncTermsConditionComponent,AsyncSessionConfirmAccountComponent,AsyncSessionConfirmationComponent
} from "Components/AsyncComponent/AsyncComponent";


/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, ...rest, token}) =>
	<Route
		{...rest}
		render={props =>
			token
				? <Component {...props} />
				: <Redirect
					to={{
						pathname: '/signin',
						state: { from: props.location }
					}}
				/>}
	/>;

class App extends Component {
	render() {
		const { location, match, user } = this.props;
		const token = getToken()

		if (location.pathname === '/') {
			if (token === null) {
				return (<Redirect to={'/signin'} />);
			} else {
				return (<Redirect to={'/app/dashboard/ecommerce'} />);
			}
		}
		return (
			<RctThemeProvider>
				<NotificationContainer />
				<InitialPath
					path={`${match.url}app`}
					token={token}
					component={RctDefaultLayout}
				/>

				<Route path="/signin" component={AppSignIn} />
				<Route path="/signup"  component={AsyncSessionPage404Component} />
				<Route
					path="/session/forgot-password"
					component={AsyncSessionForgotPasswordComponent}
				/>
				<Route path="/session/404" component={AsyncSessionPage404Component} />
				<Route path="/session/500" component={AsyncSessionPage500Component} />
				<Route path="/terms-condition" component={AsyncTermsConditionComponent} />
				<Route path="/session/confirm-account" component={AsyncSessionConfirmAccountComponent} />
				<Route path="/session/confirmation/:code" component={AsyncSessionConfirmationComponent} />
			</RctThemeProvider>
		);
	}
}

export default App

