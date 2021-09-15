import React from 'react';
import { Mode, PenColour, PenSize, Undo, Redo, FrameRate,
    Background, Next, Download } from './ControllerBtns';
import { ButtonGroup } from 'reactstrap';

export const Controller = () => {

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

export const SaveController = () => {
    return(
        <ButtonGroup className='controller mt-1 mb-1' size='sm'>
            <Download />
        </ButtonGroup>
    );
}