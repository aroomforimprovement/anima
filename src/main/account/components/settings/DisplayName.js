import React, { useState } from 'react';
import { updateDisplayName } from '../../accountReducer';
import { Loading } from '../../../../common/Loading';
import { Form, FormGroup, InputGroup, Input, Button } from 'reactstrap';
import toast from 'buttoned-toaster';
import { SITE } from '../../../../shared/site';
import { handleFailedConnection } from '../../../../common/Toast';
import { useAccount } from '../../../../shared/account';

export const DisplayName = () => {

    const [hideNameEdit, setHideNameEdit] = useState(true);
    const [isNameUpdating, setIsNameUpdating] = useState(false);
    const { account, dispatch } = useAccount();

    const handleEditUsername = (e) => {
        setHideNameEdit(!hideNameEdit);
    }

    const handleUpdateName = async (e) => {
        e.preventDefault();
        setIsNameUpdating(true);
        updateDisplayName(account.user.userid, e.target.displayName.value, account.user.access)
        .then((name) => {
            dispatch({type: 'SET_USERNAME', data: e.target.displayName.value});
            setIsNameUpdating(false);
            toast.success("Display Name updated");
        }).catch((error) => {
            handleFailedConnection(SITE.failed_connection_message, false);
        });
        
        setHideNameEdit(true);
    }

    return(
        <div>
        {account && account.user ?
        <div className='row mt-2 mb-5 ms-2 section-content'>
            <div className='col col-3 mt-1'>
                Display name:
            </div>
            <div className='col col-8'>
                {isNameUpdating 
                ? <Loading /> 
                :
                <div>
                    <div hidden={!hideNameEdit}
                        className='display-name'>
                            {account && account.user ? account.user.username : ''}
                    </div>
                    <Form onSubmit={handleUpdateName} hidden={hideNameEdit}>
                        <FormGroup >
                            <InputGroup>
                                <Input bsSize='sm' type='text' name='displayName' id='displayName' defaultValue={account.user.username}/>
                                <Button size='sm' color='secondary' onClick={handleEditUsername}>Cancel</Button>
                                <Button size='sm' color='primary'>Save</Button>
                            </InputGroup>
                        </FormGroup>
                    </Form>
                </div>
                }
            </div>
            {account && account.user && account.user.isVerified
            ? <div className='col fa fa-edit mt-1 edit-name'
                onClick={handleEditUsername}>{''}</div>
            : <div className='col fa fa-edit mt-1 edit-name'
                onClick={() => {toast.error('Verify your account to use this feature')}}>{''}</div>}
        </div>
        : <div></div>}
        </div>
    );
}