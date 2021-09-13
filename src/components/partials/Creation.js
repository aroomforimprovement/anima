import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';
import { useCreateContext } from '../Create';
export const Creation = ({sketch}) => {
    const { create, dispatch } = useCreateContext();

    return(
        <div>
            <ReactP5Wrapper sketch={sketch} create={create} dispatch={dispatch}/>
        </div>
    );
}
