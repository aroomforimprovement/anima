import React, { useState } from 'react';
import { useMainContext } from '../../main/Main';
import { useAccountContext } from '../Account';
import { updateDisplayName } from '../accountReducer';
import { Loading } from '../../common/Loading';
import { Form, FormGroup, InputGroup, Input, Button } from 'reactstrap';
import { useToastRack } from 'buttoned-toaster';

export const DisplayName = () => {

    const [hideNameEdit, setHideNameEdit] = useState(true);
    const [isNameUpdating, setIsNameUpdating] = useState(false);
    const toast = useToastRack();
    const { mainState, mainDispatch } = useMainContext();
    const { state, dispatch } = useAccountContext();
    const handleEditUsername = (e) => {
        setHideNameEdit(!hideNameEdit);
    }

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setIsNameUpdating(true);
        updateDisplayName(state.userid, e.target.displayName.value, mainState.user.access)
        .then((name) => {
            dispatch({type: 'SET_DISPLAY_NAME', data: name});
            mainDispatch({type: 'SET_USERNAME', data: name});
            setIsNameUpdating(false);
            toast.success("Display Name updated");
        });
        
        setHideNameEdit(true);
    }

    return(
        <div className='row mt-5 mb-5 display-name-area'>
            <div className='col col-3 mt-1'>
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
                {mainState.user && mainState.user.isVerified
                ? <div className='col fa fa-edit mt-1 edit-name'
                    onClick={handleEditUsername}>{''}</div>
                : <div className='col fa fa-edit mt-1 edit-name'
                    onClick={() => {toast.error('Verify your account to use this feature')}}>{''}</div>}
            </div>
    );
}