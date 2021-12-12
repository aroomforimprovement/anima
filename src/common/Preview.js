import React from 'react';
import { ReactP5Wrapper } from 'react-p5-wrapper';

const previewSketch = (p5) => {

    
}

export const Preview = () => {
    
    return(
        <div >
            <div id='preview-gen' ></div>
            <ReactP5Wrapper id='preview-viewer' sketch={previewSketch}>

            </ReactP5Wrapper>
        </div>
    );
}