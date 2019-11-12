
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';
import {Alert, Form, FormGroup, Input, Label} from 'reactstrap';
import LinearProgress from '@material-ui/core/LinearProgress';
import QueueAnim from 'rc-queue-anim';
import { NotificationManager } from 'react-notifications';

import AppConfig from 'Constants/AppConfig';
import api from "Api/index";
import OauthClient from "Constants/OauthClient";
import IntlMessages from "Util/IntlMessages";
import {injectIntl} from "react-intl";
import LanguageProvider from "Components/Header/LanguageProvider";
import{destroyToken,storeToken,getCurrentUser} from './Shared';


 class Signin extends Component {
 /****************************************************************************************************************************************/
    constructor(props)
    {
        super(props)
        this.state = {
                        visible2: false,
                        email: '',
                        password:'',
                        user:null,
                     };
    }
    /************************************************************************************************************************************/
    componentWillMount()
    {
        if(this.props.location.state)
        {
            if(this.props.location.state.newUser==="1")
                this.setState({visible2:true})    
        }
    }
    /************************************************************************************************************************************/
     onUserLogin()
    {
        const headers={'Content-Type': 'application/json'}
        api.post('signInAdmin',
                 {
                    username:this.state.email,
                    password:this.state.password,
                    client_id:OauthClient.client_id,
                    client_secret:OauthClient.oauthClient,
                    grant_type:'password'
                 },
                 {headers:headers}
                ).then((response)=> {
                                        if(response.data.result==="0")
                                            NotificationManager.error('',<IntlMessages id="components.loginError"/>);
                                        if(response.data.result==="1")
                                            NotificationManager.error('',"Access denied for user");
                                        else
                                        {
                                            const accessToken = response.data.access_token;
                                            const expiration =  JSON.stringify(response.data.expires_in+Date.now());
                                            api.get(
                                                    'user',
                                                    {headers:{'Content-Type':'application/json','Authorization':'Bearer '+accessToken}}
                                                  )
                                                .then((response)=> {
                                                                        this.setState({user:response.data},()=> { this.setUserAndTokenAndExpiration(accessToken,expiration,this.state.user); })
                                                                    })
                                                .catch((error) =>{NotificationManager.error('',<IntlMessages id="button.error"/>);})
                                        }
                                    }
                    )
                .catch((error) =>{NotificationManager.error('',<IntlMessages id="components.loginError"/>);})
    }
    /****************************************************************************************************************************************/
    setUserAndTokenAndExpiration(accessToken,expiration,user)
    { 
        if (!accessToken || !user || !expiration)
            destroyToken();
        else
        {
            storeToken(accessToken,expiration,user)
            window.location.replace('/app/dashboard/ecommerce');
        }       
    }
    /*************************************************************************************************************************************/
     onDismiss(key) {
         this.setState({ [key]: false });
     }
     /*************************************************************************************************************************************/
   
    render() {
        const { email, password} = this.state;
        const { loading } = this.props;
        const intl=this.props.intl;
        const placeholderMessage1=intl.formatMessage({id:"components.email"});
        const placeholderMessage2=intl.formatMessage({id:"compenets.password"});
        const isEnabled = email.length > 0 &&  email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)!==null && password.length>0;
        return (
            <QueueAnim type="bottom" duration={2000}>
                <div className="rct-session-wrapper">
                    {loading && <LinearProgress /> }

                    <AppBar position="static" className="session-header">
                        <Toolbar>
                            <div className="container">
                                <div className="d-flex justify-content-between">
                                    <div className="session-logo">
                                        <Link to="/">
                                            <img src={AppConfig.appLogo} alt="session-logo"  width="70" height="70" />
                                        </Link>

                                    </div>
                                    <div>
                                        <LanguageProvider />
                                        <Button variant="raised" className="btn-light" onClick={() => this.onUserSignUp()} style={{visibility:"hidden"}}> <IntlMessages id="widgets.signUp" /></Button>
                                        &nbsp;&nbsp;
                                        <a className="mr-15" style={{visibility:"hidden"}}>Create New account?</a>
                                    </div>
                                </div>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="container">
                        <div className="row row-eq-height">
                            <div className="col-sm-7 col-md-7 col-lg-8">
                                <div className="session-body text-center">
                                    <Alert color="success" isOpen={this.state.visible2} toggle={() => this.onDismiss('visible2')} style={{marginBottom:"0 !important"}}>
                                        Your activiation is completed
                                    </Alert>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="session-inner-wrapper">
                        <div className="container">
                            <div className="row row-eq-height"  style={{marginTop:"3.8vw",marginLeft:"9vw"}}>
                                <div className="col-sm-7 col-md-7 col-lg-8">
                                    <div className="session-body text-center">
                                        <div className="session-head mb-40">
                                            <h1 className="font-weight-bold" style={{color :"#04187a"}}>{AppConfig.brandName}</h1>
                                        </div>
                                        <Form>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    type="email"
                                                    value={email}
                                                    name="user-mail"
                                                    id="user-mail"
                                                    className="has-input input-lg"
                                                    placeholder={placeholderMessage1}
                                                    onChange={(event) => this.setState({ email: event.target.value })}
                                                />
                                                <span className="has-icon"><i className="ti-email"></i></span>
                                            </FormGroup>
                                            <FormGroup className="has-wrapper">
                                                <Input
                                                    value={password}
                                                    type="Password"
                                                    name="user-pwd"
                                                    id="pwd"
                                                    className="has-input input-lg"
                                                    placeholder={placeholderMessage2}
                                                    onChange={(event) => this.setState({ password: event.target.value })}
                                                />
                                                <span className="has-icon"><i className="ti-lock"></i></span>
                                            </FormGroup>
                                            <FormGroup className="mb-15">
                                                <Button
                                                    color="primary"
                                                    className="btn-block text-white w-100"
                                                    variant="raised"
                                                    size="large"
                                                    disabled={!isEnabled}
                                                    onClick={() => this.onUserLogin()}
                                                >
                                                    <IntlMessages id="compenets.signIn" />
                                                </Button>
                                            </FormGroup>
                                        </Form>
                                        <p className="mb-0"><a target="_blank" href="#/terms-condition" className="text-muted">Informations de compte oubliées ?</a></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </QueueAnim>
        );
    }
}

Signin = injectIntl(Signin)
export default Signin;
