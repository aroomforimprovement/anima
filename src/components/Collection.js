import React, { useEffect, useState } from 'react';
import { Problem } from './partials/Problem';
import { CollectionItem } from './partials/CollectionItem';
import { useAuth0 } from '@auth0/auth0-react';


const apiUrl = process.env.REACT_APP_API_URL;


const Collection = ({id}) => {

    const [collection, setCollection] = useState([]);
    const [isSet, setIsSet] = useState(false);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [access, setAccess] = useState(null);

    useEffect(() => {
        const setAccessToken = async () => {
            setAccess(await getAccessTokenSilently());
        }
        if(isAuthenticated){
            setAccessToken();
        }
    },[isAuthenticated, getAccessTokenSilently, access]);


    const getCollection = (id) => {
        const url = id ? `${apiUrl}collection/${id}` : `${apiUrl}collection`;
        return fetch(url, {
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
            console.error("error fetching collection: " + error);
        })
        .then(response => response.json())
        .then(response => {
            console.log("got collection");
            console.dir(response);
            setCollection(response);
            setIsSet(true);
        })
        .catch(err => console.log(err))
        .finally(response => {
            console.log("finally");
            console.dir(response);
        })
    }

    if(!isSet){
        getCollection(id);
    }

    const collectionItems = collection.map((anim, i) => {

        return(
            <CollectionItem key={i} anim={anim}/>
        );
    });
    
    return(
        <div className='container'>
            {collectionItems}
        </div>
    );
}

export default Collection;