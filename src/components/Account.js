import React, { useEffect, useReducer, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const apiUrl = process.env.REACT_APP_API_URL;

const Account = () => {
    const [access, setAccess] = useState(null);
    const { isLoading, isAuthenticated, getAccessTokenSilently, user } = useAuth0(); 
    
    const accountReducer = () => {

    }

    const [state, dispatch] = useReducer(accountReducer, {});
    
    
    const getAccountInfo = (id) => {
        return fetch(`${apiUrl}account/${id}`, {
            headers: {
                Authorization: `Bearer ${access}`
            }   
        })
        .then(response => {
            if(response.ok){
                return response;
            }else{
                console.error("response not ok");
                console.dir(response);
            }
        }, error => {
            console.error("error fetching anim " + error);
        })
        .then(response => response.json())
        .then(response => {
            console.log("got account info");
            console.dir(response);
            //do something
        })
        .catch(err => console.error(err))
        .finally(response => {
            console.log("finally");
            console.dir(response);
        })
    }

    const getAccountId = () => {
        if(user){
            return user.sub.replace('auth0|', '');
        }else{
            console.log("no user");
        }
    }



    useEffect(() => {
        const setAccessToken = async () => {
            setAccess(await getAccessTokenSilently());
        }
        if(!isLoading && isAuthenticated){
            setAccessToken();
        }
    },[isAuthenticated, isLoading, getAccessTokenSilently, access]);

    if(!state.isSet && access){
        //get user id
        const id = getAccountId();
        getAccountInfo(id);
    }

    return(
        <div className='container'>
            <div className='row'>
                <div className='col col-3'>
                    Username:
                </div>
                <div className='col col-8'>
                    {}
                </div>
            </div>
        </div>
    );
}

export default Account;