import React from 'react';
import { Problem } from './partials/Problem';
import Controller from './partials/Controller';
import { Jumbotron } from 'reactstrap';
import { Creation } from './partials/Creation';
import { creator } from '../sketches/creator';


const Create = () => {
    //return(
    //    <Problem message={"Page is not implemented"}/>
    //);

    return(
        <div>
            <Jumbotron >
                <Controller />
                <Creation sketch={creator} />
            </Jumbotron>
        </div>
    );
}

export default Create;