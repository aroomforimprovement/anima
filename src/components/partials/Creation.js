import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';

export const Creation = ({sketch}) => {
    return(
        <div>
            <ReactP5Wrapper sketch={sketch} />
        </div>
    );
}
