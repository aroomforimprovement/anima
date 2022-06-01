import React from 'react';
import { AdjustBg, AdjustBgFrame, Background, Download, FrameRate, Mode, Next, PenColour, PenSize, Preview, Redo, Save, Undo } from '../create/controller/ControllerBtns';
import './help.scss';


export const Help = () => {

    const HelpSection = ({heading, text, children}) => {
        return(
            <div className='help-page container my-5'>
                <div className='help-section col col-12'>
                <div className='row'>
                    <div className={children ? 'col col-9 help-text' : ''}>
                        <h5>{heading}</h5>
                        <p>{text}</p>
                    </div>
                    <div className='col col-1 help-img'>
                        {children}
                    </div>
                </div>
                </div> 
            </div> 
        )
    }

    return(
        <div className='row'>
            <div className='col col-12 col-md-5'>
                <HelpSection
                    heading={`What is this site?`}
                    text={`This is a web-app that allows you to create and share simple, hand-drawn animations on your computer or mobile device.`} />
                <HelpSection
                    heading={`Cool - how do I do that?`}
                    text={`Most of the action happens on the Create page.
                        There, you have a canvas to "paint" on and a set of controls to help you make an animation.
                        You can use a mouse, a stylus or your finger, depending on your device, to make marks on the canvas.
                        Below, you can find out what the various controls do.`}
                ></HelpSection>
                <HelpSection heading='Controls' />
                <HelpSection
                    heading={`Mode`}
                    text={`Pick one of these settings to draw one point at a time, two points mirrored right-left, two points mirrored top-bottom, or four points.`} 
                >
                    <Mode dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Pen Size'}
                    text={'Pick one of these options to set the size of the mark made on the canvas'}>
                    <PenSize dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Pen Colour'}
                    text={'Pick one of these options to change the colour of the mark made on the canvas'}>
                    <PenColour dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Undo / Redo'}
                    text={`Click these to undo or redo the last stroke. If you click Next, ie go on to the next frame, you can no longer undo strokes from the previous frame.`} >
                    <Undo dummy={true}/>
                    <Redo dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Frame Rate'}
                    text={'Choose on of these options to set the frame rate that your animation will have when played back. You can change this as many times as you like but the whole animation will be set to the last frame rate chosen.'}>
                    <FrameRate dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Background'}
                    text={'With these three options, you can save the current canvas as a background (meaning it will be redrawn after you move to the next frame), clear the current frame\'s drawing and draw any saved background, or just wipe the current frame and set a blank background.'}
                >
                <Background dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Next'}
                    text={`When you are done drawing the current frame, click this to move to the next frame. This will clear the current drawing and draw any saved background. You'll still be able to see faintly see the previous drawing under the background (this is to help you make an animation, rather than a number of unconnected images in sequence) and you can set the opacity of the blank background and the saved background drawing (see opacity controls below).`}>
                    <Next dummy={true}/>
                </HelpSection>
            </div>
            <div className='col col-12 col-md-5'>
                <HelpSection
                    heading={'More controls'}/>
                <HelpSection
                    heading={'Save'}
                    text={'Use this to name and save your animation. We advise saving early and often because we are alive in the world in the 21st Century. You\'ll need to make an account if you want to save the animation on the site. If you want to retrieve all of your saved animations, edit them, and use other features on the site, you\'ll also need to verify your email address.'} >
                    <Save dummy={true} />
                </HelpSection>
                <HelpSection 
                    heading={'Download'}
                    text={'Click this to download a video file of your animation.'}>
                    <Download dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Preview'}
                    text={'Click this to render a preview of your animation that will play in a pop up window (give it a few seconds for longer animations).'}>
                    <Preview dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Background Overlay Opacity'}
                    text={'Choose one of these options to change the opacity of the blank background that is drawn over the previous frame when you click Next. This won\'t affect the opacity when the animation is rendered - it\'s just for when you are editing.'}
                >
                    <AdjustBg dummy={true}/>
                </HelpSection>
                <HelpSection
                    heading={'Background Drawing Opacity'}
                    text={'Choose one of these options to change the opacity of the saved background drawing when drawn over the previous frame. This won\'t affect the opacity when the animation is rendered - it\'s just for when you are editing.'} 
                >
                    <AdjustBgFrame dummy={true} />
                </HelpSection>
                <HelpSection 
                    heading={'Shortcuts'}
                    text={'Most of these controls can be triggered using keyboard shortcuts if you are on a laptop / desktop. You can read all of the available shortcuts on the Create page.'}/>
            </div>
        </div>
    )
    
}