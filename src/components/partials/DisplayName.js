import React, { useState } from 'react';
import { useMainContext } from '../Main';
import { useAccountContext } from '../Account';
import { updateDisplayName } from '../../redux/Account';
import { Loading } from './Loading';
import { Form, FormGroup, InputGroup, Input, Button } from 'reactstrap';

export const DisplayName = () => {

    const [hideNameEdit, setHideNameEdit] = useState(true);
    const [isNameUpdating, setIsNameUpdating] = useState(false);

    const { mainState, mainDispatch } = useMainContext();
    const { state, dispatch } = useAccountContext();
    const handleEditUsername = (e) => {
        console.log("handleEditUsername");
        setHideNameEdit(!hideNameEdit);
    }

    const handleUpdateName = async (e) => {
        console.log("handleUpdateName");
        e.preventDefault();
        setIsNameUpdating(true);
        updateDisplayName(state.userid, e.target.displayName.value, mainState.user.access)
        .then((name) => {
            dispatch({type: 'SET_DISPLAY_NAME', data: name});
            mainDispatch({type: 'SET_USERNAME', data: name});
            setIsNameUpdating(false);
        });
        
        setHideNameEdit(true);
    }

    return(
        <div className='row mt-5 mb-5'>
            <div className='col col-3 mt-1 small'>
                Display name:
            </div>
            <div className='col col-8'>
                {isNameUpdating 
                ? <Loading /> 
                :
                <div>
                    <div hidden={!hideNameEdit}
                        className='display-name'>{state.username}</div>
                        <Form onSubmit={handleUpdateName} hidden={hideNameEdit}>
                            <FormGroup >
                                <InputGroup>
                                    <Input bsSize='sm' type='text' name='displayName' id='displayName' defaultValue={state.username}/>
                                    <Button size='sm' color='secondary' onClick={handleEditUsername}>Cancel</Button>
                                    <Button size='sm' color='primary'>Save</Button>
                                </InputGroup>
                            </FormGroup>
                        </Form>
                    </div>
                }
            </div>
            <div className='col fa fa-edit mt-1 edit-name'
                onClick={handleEditUsername}>
                    {''}
                </div>
            </div>
    );
}