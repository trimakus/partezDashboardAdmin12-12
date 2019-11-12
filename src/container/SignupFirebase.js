/**
 * Sign Up With Firebase
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

import QueueAnim from 'rc-queue-anim';
import {
	signupUserInFirebase,
	signinUserWithFacebook,
	signinUserWithGoogle,
	signinUserWithGithub,
	signinUserWithTwitter
} from 'Actions';

class SignupFirebase extends Component {

	render() {
		return (
			<QueueAnim type="bottom" duration={2000}>
				
			</QueueAnim>
		);
	}
}

// map state to props
const mapStateToProps = ({ authUser }) => {
	const { loading } = authUser;
	return { loading };
};

export default connect(mapStateToProps, {
	signupUserInFirebase,
	signinUserWithFacebook,
	signinUserWithGoogle,
	signinUserWithGithub,
	signinUserWithTwitter
})(SignupFirebase);
