
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import Button from '@material-ui/core/Button';
import {Col, Label, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter, Badge} from 'reactstrap';
import { NotificationManager } from 'react-notifications';
import api from 'Api';
import DeleteConfirmationDialog from 'Components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
import IntlMessages from 'Util/IntlMessages';
import RctCollapsibleCard2 from 'Components/RctCollapsibleCard/RctCollapsibleCard2';
import { textTruncate } from 'Helpers/helpers';
import {getToken} from "../../container/Shared";
import "./games.css";
import RctSectionLoader from "Components/RctSectionLoader/RctSectionLoader";
import Tooltip from "@material-ui/core/Tooltip";
import DialogContent from "@material-ui/core/DialogContent";

import Dialog from "@material-ui/core/Dialog";
import UpdateGame from "Routes/games/UpdateGame";

const headers={'Content-Type': 'application/json','Authorization':'Bearer'+' '+getToken()}
export default class Games extends Component {

    state =
        {

            typeOfGames:[],
            searchTypeGameResult:[],
            newTypeOfGame:{id:'',name:'',numberOfGames:0},
            selectedTypeOfGame:null,
            indexOfSeletedTypeOfGame:-1,
            searchTypeValue:'',
            searchResultTypeValue:'',
            loadingType:true,
            updateTypeOfGameModal:false,
            editTypeOfGame:null,

            games:[],
            addNewGame:{ id: '', name: '', description: '', gameUrl: '',categorieName:''},
            selectedGame: null,
            indexOfSeletedGame:-1,
            searchGameValue:'',
            searchTypeValue2:'',
            searchResultGame:[],
            loadingGame:true,
            categories:null,
            categorieName:'all',
            selectedGameToView:null,
            openViewGameDialog: false, // view user dialog box
            editGame:null,
            updateGameModal:false,
        }
/***************************************************************************************************************************/
    componentDidMount() 
    {
        this.getAllCategories();
        this.getAllGames();
        this.getCategories(); // for search
    }
/***********************************************************************************************************************************/
    getAllCategories()
    {
        api.get('getAllCategories',{headers:headers})
            .then((response) => {
                this.setState({ typeOfGames: response.data.list,loadingType:false });
            })
            .catch(error => {NotificationManager.error('','Error');})
    }
/***********************************************************************************************************************************/
    getCategories()  //which have games : we use it for search game
    {
        api.get('getCategoriesHaveGames', {headers:headers})
            .then((response)=>{this.setState({categories:response.data.list })})
            .catch(error =>console.log(error))
    }
 /***********************************************************************************************************************************/
    onChangeAddNewTypeGame(key, value)
    {
        this.setState({newTypeOfGame: {...this.state.newTypeOfGame, [key]: value}});
    }
 /***********************************************************************************************************************************/
    createCategorie()
    {
        api.get('getAllCategories',{headers:headers})
            .then((response) => {
                this.setState({ typeOfGames: response.data.list },()=>{
                   let typeOfGames = this.state.typeOfGames;
                    api.post('createCategorie',{  name:this.state.newTypeOfGame.name }, {headers: headers})
                        .then((response) =>
                        {
                            if(response.data.result==="0")
                            NotificationManager.error('','Type of game duplicated ')
                        else
                            {
                                let newType = {...this.state.newTypeOfGame, id: response.data.result}
                                typeOfGames.push(newType)
                                setTimeout(() => {
                                    this.setState({typeOfGames, newTypeOfGame: {name: '', id: ''},searchTypeValue:''});
                                    NotificationManager.success('', 'New type of game created successfully  ');
                                }, 2000);
                            }
                        })
                        .catch(error => {NotificationManager.error('','Erreur');})
                });
            })
            .catch(error => {NotificationManager.error('','Error');})
    }
/*********************************************************************************************************************************/
    onEditTypeGame(typeOfGame)
    {
        this.setState({ updateTypeOfGameModal: true, editTypeOfGame: typeOfGame })
    }
/********************************************************************************************************************************/
    onAddUpdateTypeGameModalClose(type)
    {
        this.setState({ updateTypeOfGameModal: false, editTypeOfGame: null })
    }
/***************************************************************************************************************************/
    onChangeUpdateTypeGame(key, value)
    {
        this.setState({editTypeOfGame: {...this.state.editTypeOfGame, [key]: value}});
    }
/**************************************************************************************************************************/
    updateTypeOfGame()
    {
        const { editTypeOfGame } = this.state;
        let indexOfUpdateTypeOfGame = '';
        let typeOfGames = this.state.typeOfGames;
        for (let i = 0; i < typeOfGames.length; i++) {
            const typeOfGame = typeOfGames[i];
            if (typeOfGame.id === editTypeOfGame.id)
                indexOfUpdateTypeOfGame = i
        }
        typeOfGames[indexOfUpdateTypeOfGame] = editTypeOfGame;
        api.post('editCategorie',{ id:editTypeOfGame.id, name:editTypeOfGame.name }, {headers: headers})
            .then((response) =>
            {
                if(response.data.result==='0')
                    NotificationManager.error('','Type of game duplicated ')
                else if(response.data.result==='-1')
                    NotificationManager.error('','Error');
                else
                {
                    this.setState({ editTypeOfGame: null, updateTypeOfGameModal: false });
                    let self = this;
                    setTimeout(() => {
                        self.setState({ typeOfGames });
                        NotificationManager.success('Type Of Game Updated!');
                    }, 2000);
                }
            })
            .catch(error => {NotificationManager.error('','Error');})
    }
/***************************************************************************************************************************/
    onDeleteTypeGame(data,index)
    {
        this.refs.deleteConfirmationDialogTypeOfGame.open();
        this.setState({ selectedTypeOfGame: data,indexOfSeletedTypeOfGame:index });
    }
/***************************************************************************************************************************/
    deleteTypeOfGamePermanently() {
        const { selectedTypeOfGame,indexOfSeletedTypeOfGame } = this.state;
        let typeOfGames = this.state.typeOfGames;
        typeOfGames.splice(indexOfSeletedTypeOfGame, 1);
        this.refs.deleteConfirmationDialogTypeOfGame.close();

        api.get('deleteCategorie/'+selectedTypeOfGame.id, {headers:headers})
            .then((response)=>{
                if(response.data.result===true)
                {
                    this.getAllGames();
                    setTimeout(() => {
                        this.setState({ typeOfGames, selectedTypeOfGame: null,indexOfSeletedTypeOfGame:-1 })
                        NotificationManager.success('Type of Game Deleted!');
                    }, 2000);
                }
            })
            .catch(error =>{ NotificationManager.error('','Error');})
    }
/***************************************************************************************************************************/
    handleChange1(key,value)  //for type of game
    {
        this.setState({ [key]: value }, () => { this.searchForTypeOfGames()});
    }
/***************************************************************************************************************************/
    searchForTypeOfGames()
    {
        if(this.state.searchTypeValue==='')
            this.setState({typeOfGames:[]},()=>{
                this.getAllCategories()
            })
        else
        {
            api.get('searchForTypeOfGame/'+this.state.searchTypeValue, {headers:headers})
                .then((response)=>{this.setState({typeOfGames:response.data.result})})
                .catch(error =>console.log(error))
        }
    }
/***************************************************************************************************************************/
    onReloadType()
    {
        this.setState({loadingType:true},()=>{
            this.getAllCategories();
            this.setState({searchTypeValue:''})
        })
    }
/***************************************************************************************************************************/
    getAllGames()
    {
        api.get('getAllGames',{headers:headers})
            .then((response) => {
                this.setState({ games: response.data.list,loadingGame: false });
            })
            .catch(error => {
                NotificationManager.error('','Error');
            })
    }
/***************************************************************************************************************************/
    onChangeAddNewGameDetails(key, value) {
        this.setState({addNewGame: {...this.state.addNewGame, [key]: value}});
    }
/***********************************************************************************************************************/
    createGame()
    {
        const { addNewGame} = this.state
        api.post(
                    'createGame',
                    {
                        name:addNewGame.name,
                        description:addNewGame.description,
                        gameUrl:addNewGame.gameUrl,
                        categorieName:addNewGame.categorieName
                    },
                    {headers: headers}
                )
            .then((response) =>
            {
                if(response.data.result==="0")
                    NotificationManager.error('','game name duplicated')
               else
                {
                    this.setState({searchTypeGameResult:[]})
                    let games = this.state.games;
                    let newGame = {...addNewGame, id: response.data.result}
                    games.push(newGame)
                    setTimeout(() => {
                        this.setState({  games,typeOfGames:[], addNewGame:{ id: '', name: '', description: '', gameUrl: '', categorieName: ''}},()=>{
                            this.getAllCategories();
                        });
                        NotificationManager.success('','New  game created successfully  ');
                    }, 2000);
                }
            })
            .catch(error => {NotificationManager.error('','Erreur');})
    }
/***************************************************************************************************************************/
    onReloadGame()
    {
        this.setState({loadingGame:true},()=>{
            this.getAllGames();
            this.setState({searchGameValue:''})
        })
    }
/***************************************************************************************************************************/
    onDeleteGame(data,index)
    {
        this.refs.deleteConfirmationDialogGame.open();
        this.setState({ selectedGame: data,indexOfSeletedGame:index });
    }
/***************************************************************************************************************************/
    deleteGamePermanently() {
        const { selectedGame,indexOfSeletedGame } = this.state;
        let games = this.state.games;
        games.splice(indexOfSeletedGame, 1);
        this.refs.deleteConfirmationDialogGame.close();
        this.setState({ loading: true });
        api.get('deleteGame/'+selectedGame.id, {headers:headers})
            .then((response)=>{
                if(response.data.result==="1")
                {
                    this.getAllCategories();
                    setTimeout(() => {
                        this.setState({ loading: false, games, selectedGame: null,indexOfSeletedGame:-1 })
                        NotificationManager.success('Game Deleted!');
                    }, 2000);
                }
            })
            .catch(error =>{ NotificationManager.error('','Error');})
    }
/***************************************************************************************************************************/
    viewGameDetail(game)
    {
        this.setState({ openViewGameDialog: true, selectedGameToView: game });
    }
/***************************************************************************************************************************/
    onEditGame(game)
    {
        this.setState({ updateGameModal:true, editGame: game });
    }
/***************************************************************************************************************************/
    onEditGameModalClose()
    {
        this.setState({ updateGameModal:false, editGame: null })
    }
 /***************************************************************************************************************************/
    onUpdateGameDetails(key, value)
    {
        this.setState({editGame: {...this.state.editGame,[key]: value}});
    }
/***************************************************************************************************************************/
    updateGame()
    {
        const { editGame } = this.state;
        console.log(editGame);
        let indexOfUpdateGame = '';
        let games = this.state.games;
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            if (game.id === editGame.id)
                indexOfUpdateGame = i
        }
        games[indexOfUpdateGame] = editGame;
        api.post(
                    'editGame',
                    { id:editGame.id, name:editGame.name, description:editGame.description,gameUrl:editGame.gameUrl,categorieName:editGame.categorieName},
                    {headers: headers})
            .then((response) =>
            {
                if(response.data.result==='0')
                    NotificationManager.error('','Game duplicated ')
                else if(response.data.result==='-1')
                    NotificationManager.error('','Error');
                else
                {
                    this.setState({ editGame: null, updateGameModal: false });
                    let self = this;
                    setTimeout(() => {
                        self.setState({ Games },()=>{this.getAllCategories();});
                        NotificationManager.success('Type Of Game Updated!');
                    }, 2000);
                }
            })
            .catch(error => {NotificationManager.error('','Error');})
    }
/***************************************************************************************************************************/
    handleChange2(key,value) //for game
    {
        this.setState({ [key]: value }, () => {this.getGamesByCategorie(this.state.categorieName)});
    }
/***********************************************************************************************************************************/
    getGamesByCategorie(nameOfCategorie) //name of the categorie ad
    {
        if(nameOfCategorie!==null)
        {
            if(nameOfCategorie!=='all') //user a choisi ue categorie bien defini
            {
                api.post('getGamesByCategorie',{name:nameOfCategorie,gameName:this.state.searchGameValue} ,{headers:headers})
                    .then((response)=>{this.setState({games:response.data.list })})
                    .catch(error =>console.log(error))
            }
            else // sinn
            {
                if(this.state.searchGameValue==='')
                    this.getAllGames()
                else
                {
                    api.get('searchForGame/'+this.state.searchGameValue, {headers:headers})
                        .then((response)=> {this.setState({games:response.data.list})})
                        .catch(error =>console.log(error))
                }
            }
        }
    }
/***************************************************************************************************************************/

/***************************************************************************************************************************/

/***************************************************************************************************************************/

/***************************************************************************************************************************/
    render() {
        const {
                newTypeOfGame,typeOfGames,searchTypeValue,searchTypeGameResult,loadingType,editTypeOfGame,
                games,addNewGame,searchGameValue,loadingGame, selectedGameToView,categories,editGame
              } = this.state;
        const isEnabled = newTypeOfGame.name!=='';
        return (
            <div>
                <div className="user-management">
                    <Helmet>
                        <title>Reactify |Game Management</title>
                        <meta name="description" content="Reactify Widgets" />
                    </Helmet>
                    <PageTitleBar
                        title={<IntlMessages id="sidebar.gameManagement" />}
                        match={this.props.match}
                    />
                    {/****************************************   Type Of Game  ***********************************************************************/}
                    <div className="col-sm-12 col-md-12 col-xl-12">
                        <RctCollapsibleCard2 heading="Types of games" collapsible>
                            <div>
                                <a onClick={() => this.onReloadType()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                            </div>
                            <br/>
                            {/**************************************** Add Type Of Game  ********************************************************/}
                            <Form>
                                <FormGroup row>
                                    <Label for="typeOfGame" sm={3}><IntlMessages id="components.typeOfGame" /></Label>
                                    <Col sm={6}>
                                        <Input 
                                            type="text"
                                            id="typeOfGame"
                                            value={newTypeOfGame.name}
                                            onChange={(e) => this.onChangeAddNewTypeGame('name', e.target.value)}
                                        />
                                    </ Col>
                                    <Col sm={3}>
                                         <Button variant="raised" color="primary" className="text-white"  disabled={!isEnabled}  onClick={() => this.createCategorie()}><IntlMessages id="widgets.addNew" /></Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                            {/****************************************  list Type Of Game  ********************************************************/}
                            <br/>
                            <div className="table-responsive">
                                {/****************************************  Search Type Of Game  ********************************************************/}
                                <div style={{backgroundColor:"#e8edfc",padding:"2vw",marginBottom:"2vw",marginTop:"2vw"}}>
                                    <form>
                                        <FormGroup row>
                                            <Col sm={9}>
                                                <Input
                                                    type="text"
                                                    name="search"
                                                    placeholder="Search..."
                                                    onChange={(event) => this.handleChange1( 'searchTypeValue',event.target.value)}
                                                    value={searchTypeValue}
                                                />
                                            </Col>
                                        </FormGroup>

                                    </form>
                                </div>
                                {
                                    typeOfGames.length === 0 && searchTypeValue!=='' ?
                                        <p style={{color: "red", fontStyle: "italic"}}><IntlMessages id="widgets.noResultForSearch"/></p>
                                    :
                                    <table className="table table-middle table-hover mb-0">
                                        <thead>
                                        <tr>
                                            <th>Type Of Game</th>
                                            <th>Number Of Games</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {typeOfGames.length>0 && typeOfGames.map((type, key) => (
                                            <tr key={key}>
                                                <td>{type.name}</td>
                                                <td>{type.numberOfGames}</td>
                                                <td className="list-action">
                                                    <Tooltip title="Edit Type Of Game" placement="bottom">
                                                        <a onClick={() => this.onEditTypeGame(type)}><i
                                                            className="ti-pencil"></i></a>
                                                    </Tooltip>

                                                    <Tooltip title="Delete Type Of Game" placement="bottom">
                                                        <a onClick={() => this.onDeleteTypeGame(type, key)}><i
                                                            className="ti-close"></i></a>
                                                    </Tooltip>

                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                }
                            </div>
                            {loadingType && <RctSectionLoader />}
                        </RctCollapsibleCard2>
                    </div>
                    <br/>

                    {/****************************************    Game  ***********************************************************************/}
                    <div className="col-sm-12 col-md-12 col-xl-12">
                        <RctCollapsibleCard2 heading="Games" collapsible>
                            <div>
                                <a onClick={() => this.onReloadGame()} className="btn-outline-default mr-10"><i className="ti-reload"></i></a>
                            </div>
                            <br/>
                            {/****************************************    Create Game  ***********************************************************************/}
                            <UpdateGame game={addNewGame}
                                        typeOfGames={typeOfGames}
                                        onUpdateGameDetails={this.onChangeAddNewGameDetails.bind(this)}
                                        onOk={this.createGame.bind(this)}
                                        update="0"/>
                            {/****************************************   fin Create Game  ***********************************************************************/}

                            <br/>
                            <div className="table-responsive">
                                {/****************************************   Search For Game  ***********************************************************************/}
                                <div style={{backgroundColor:"#e8edfc",padding:"2vw",marginBottom:"2vw",marginTop:"2vw"}}>
                                    <form className="form-inline">
                                        <Col sm={12}>
                                            <FormGroup>
                                                <Input type="select" name="categorie" id="categorieName"  onChange={(e) => this.handleChange2('categorieName',e.target.value)}>
                                                    <option  value="0" id="op" value="all">all</option>
                                                    {categories && categories.map((categorie) =>
                                                        <option key={categorie.id} value={categorie.name}>{categorie.name}</option>)
                                                    }
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <FormGroup row>
                                            <Col sm={10}>
                                                <Input
                                                    type="text"
                                                    name="search"
                                                    placeholder="Search Fro Game .."
                                                    onChange={(event) => this.handleChange2( 'searchGameValue',event.target.value)}
                                                    value={searchGameValue}
                                                />
                                            </Col>
                                        </FormGroup>
                                    </form>
                                </div>
                                {/****************************************   list of Games  ***********************************************************************/}

                                <table className="table table-middle table-hover mb-0">
                                    <thead>
                                    <tr>
                                        <th>Game Name</th>
                                        <th>Game Url</th>
                                        <th>Description </th>
                                        <th>Game Type </th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {games.length>0 && games.map((game, key) => (
                                    <tr key={key}>
                                        <td>{game.name}</td>
                                        <td>{game.gameUrl}</td>
                                        <td> {textTruncate(game.description, 30)}</td>
                                        <td>{game.categorieName}</td>
                                        <td className="list-action">
                                            <Tooltip title="View Game Details" placement="bottom">
                                                <a onClick={() => this.viewGameDetail(game)}><i className="ti-eye"></i></a>
                                            </Tooltip>

                                            <Tooltip title="Edit Game" placement="bottom">
                                                <a onClick={() => this.onEditGame(game)}><i className="ti-pencil"></i></a>
                                            </Tooltip>

                                            <Tooltip title="Delete Game" placement="bottom">
                                                <a  onClick={() => this.onDeleteGame(game,key)}><i className="ti-close"></i></a>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                                    </tbody>
                                </table>
                                {/****************************************   list of Games  ***********************************************************************/}
                            </div>
                            {loadingGame && <RctSectionLoader />}
                        </RctCollapsibleCard2>
                    </div>
                </div>
                {/********************************************************************************************************************************/}
                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialogTypeOfGame"
                    title="Are You Sure Want To Delete?"
                    message="This will delete this type of game and all games of this type."
                    onConfirm={() => this.deleteTypeOfGamePermanently()}
                />
                {/********************************************************************************************************************************/}
                <DeleteConfirmationDialog
                    ref="deleteConfirmationDialogGame"
                    title="Are You Sure Want To Delete?"
                    message="This will delete this game permanently."
                    onConfirm={() => this.deleteGamePermanently()}
                />
                {/*******************************************Madal update Type Of Game ********************************************************************************/}
                {editTypeOfGame !==null ?
                <Modal isOpen={this.state.updateTypeOfGameModal} toggle={() => this.onAddUpdateTypeGameModalClose()}>
                    <ModalHeader toggle={() => this.onAddUpdateTypeGameModalClose()}>
                           Update Type Of Game
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="typeOfGame">Type of game</Label>
                                <Input
                                    type="text"
                                    id="typeOfGame"
                                    name="name"
                                    value={editTypeOfGame.name}
                                    onChange={(e) => this.onChangeUpdateTypeGame('name', e.target.value)}
                                />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="raised" color="primary" className="text-white" onClick={() => this.updateTypeOfGame()} disabled={editTypeOfGame.name===''}>Update</Button>
                        {' '}
                        <Button variant="raised" className="text-white btn-danger" onClick={() => this.onAddUpdateTypeGameModalClose()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                    :''}
                {/*********************************************View Game***********************************************************************************/}

                <Dialog
                    onClose={() => this.setState({ openViewGameDialog:false })}
                    open={this.state.openViewGameDialog}
                >
                    <DialogContent>
                        {selectedGameToView !== null &&
                        <div>
                            <div className="clearfix d-flex">
                                <div className="media pull-left">
                                    <div className="media-body">
                                        <div style={{display:"inline-block"}}>
                                            <h4 style={{color:"#7b9ae8",float:"left"}}>Game Name:</h4>&nbsp;&nbsp;
                                            <span>{selectedGameToView.name}</span>
                                        </div>
                                        <hr/>
                                        <div style={{display:"inline-block"}}>
                                            <h4 style={{color:"#7b9ae8",float:"left"}}>Game Categorie:</h4>&nbsp;&nbsp;
                                            <span>{selectedGameToView.categorieName}</span>
                                        </div>
                                        <hr/>
                                        <div style={{display:"inline-block"}}>
                                            <h4 style={{color:"#7b9ae8",float:"left"}}>Game Url:</h4>&nbsp;&nbsp;
                                            <span>{selectedGameToView.gameUrl}</span>
                                        </div>
                                        <hr/>
                                        <div style={{display:"inline-block"}}>
                                            <h4 style={{color:"#7b9ae8",float:"left"}}>Description:</h4>&nbsp;&nbsp;
                                            <span>{selectedGameToView.description}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </DialogContent>
                </Dialog>
                {/*********************************************Edit Game***********************************************************************************/}
                {editGame!==null ?
                <Modal isOpen={this.state.updateGameModal} toggle={() => this.onEditGameModalClose()}>
                    <ModalHeader toggle={() => this.onEditGameModalClose()}>
                        Update Type Of Game
                    </ModalHeader>
                    <ModalBody>
                        <UpdateGame game={editGame}
                                    onUpdateGameDetails={this.onUpdateGameDetails.bind(this)}
                                    typeOfGames={typeOfGames}
                                    update="1" />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="raised" color="primary" className="text-white" onClick={() => this.updateGame()} >Update</Button>
                        {' '}
                        <Button variant="raised" className="text-white btn-danger" onClick={() => this.onEditGameModalClose()}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                :''}
                {/*******************************************************************************************************************************/}

            </div>


        );
    }
}
