/**
 * Update User Details Form
 */
import React from 'react';
import { Form, FormGroup, Label, Input,Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import IntlMessages from 'Util/IntlMessages';


const UpdateGame= ({ game, onUpdateGameDetails,typeOfGames,onOk,update }) => (
    <Form>
        <FormGroup row>
            <Label for="gameName" sm={3}><IntlMessages id="components.gameName"/></Label>
            <Col sm={9}>
                <Input
                    type="text"
                    value={game.name}
                    id="gameName"
                    onChange={(e) => onUpdateGameDetails('name', e.target.value)}
                />
            </Col>
        </FormGroup>

        <FormGroup row>
            <Label for="gameUrl"  sm={3}><IntlMessages id="components.gameUrl" /></Label>
            <Col sm={9}>
                <Input
                    type="text"
                    value={game.gameUrl}
                    id="gameUrl"
                    onChange={(e) => onUpdateGameDetails('gameUrl', e.target.value)}
                />
            </Col>
        </FormGroup>

        <FormGroup row>
            <Label for="description" sm={3}><IntlMessages id="components.description"/></Label>
            <Col sm={9}>
                <textarea
                    value={game.description || ''}
                    id="description"
                    rows="6"
                    onChange={(e) => onUpdateGameDetails('description', e.target.value)}
                />
            </Col>
        </FormGroup>

        <FormGroup row>
            <Label for="type" sm={3}><IntlMessages id="components.typeOfGame"/></Label>
            <Col sm={9}>
                <Input
                    type="select"
                    name="categorie"
                    id="type"
                    onChange={(e) =>onUpdateGameDetails('categorieName', e.target.value)}
                >
                    <option  value="0" id="op" hidden={game.categorieId !== null}>Choose a type of game</option>
                    {typeOfGames && typeOfGames.map((type) =>
                        <option key={type.id} value={type.name} selected={game.categorieName === type.name && update==="1"}>{type.name}
                        </option>
                    )}
                </Input>
            </Col>
        </FormGroup>
        {update==="0"?
            <Button variant="raised" color="primary" className="text-white" onClick={() => onOk()}><IntlMessages id="widgets.addNew" /></Button>
            :''
        }
    </Form>
);

export default UpdateGame;
