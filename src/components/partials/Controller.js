import React from 'react';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate } from './ControllerBtns';
import { ButtonGroup } from 'reactstrap';

const Controller = ({create}) => {

    return(
        <div className='container controller' >
            <p>Control panel</p>
            <ButtonGroup>
                <Mode />
                <PenSize />
                <PenColour />
                <Undo />
                <Redo />
                <FrameRate />
            </ButtonGroup>
        </div>
    );
}

export default Controller;