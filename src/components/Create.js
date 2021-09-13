import React from 'react';
import { Problem } from './partials/Problem';
import Controller from './partials/Controller';
import { Jumbotron } from 'reactstrap';
import { Creation } from './partials/Creation';
import { sketch } from '../animator/sketch';


const Create = () => {
    //return(
    //    <Problem message={"Page is not implemented"}/>
    //);

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