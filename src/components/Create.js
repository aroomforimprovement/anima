import React from 'react';
import Controller from './partials/Controller';
import { Jumbotron } from 'reactstrap';
import { Creation } from './partials/Creation';
import { sketch } from '../animator/sketch';


const Create = () => {

    
    return(
        <div>
            <Jumbotron >
                <Controller />
                <Creation sketch={sketch} />
            </Jumbotron>
        </div>
    );

}

export default Create;