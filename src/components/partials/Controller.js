import React from 'react';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate,
    Background, Next } from './ControllerBtns';
import { ButtonGroup } from 'reactstrap';

const Controller = ({create}) => {

    return(
        <ButtonGroup className='controller mt-1 mb-1' size='sm'>
            <Mode />
            <PenSize />
            <PenColour />
            <Undo />
            <Redo />
            <FrameRate />
            <Background />
            <Next />
        </ButtonGroup>
    );
}

export default Controller;