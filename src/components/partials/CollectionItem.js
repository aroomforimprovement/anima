import React, { useState } from "react";
import { SITE } from "../../shared/site";
import { Modal, ModalFooter, Button } from "reactstrap";
import { useControlContext } from "../Create";
import { ReactP5Wrapper } from "react-p5-wrapper";
import { sketch } from "../../animator/sketch";

export const CollectionItem = ({anim}) => {
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const handlePreview = (e) => {
        setIsPreviewOpen(true);
    }

    const handleDownload = (e) => {

    }

    return(
        <div className='container col col-6 col-lg-8 border border-black rounded coll-item'>
            <div className='row'>
                <img src='' alt={anim.name}
                    className='col col-2 border mt-2 ms-2'></img>
                <div className='col col-6 mt-2'>
                    <h5 >{anim.name}</h5>
                    <div className='coll-item-username' >by {anim.username}</div>  
                </div>
            </div>
            <div className='row coll-item-detail mt-2 mb-2'>
                <div className='col col-6'>
                <div >Created: {anim.created}</div>
                          
                {//not sure why frames is undefined at this point
                }
                <div >Length: {parseFloat(anim.frames ? anim.frames.length : 1 / anim.frate).toFixed(2)}</div>
                </div>
                <div className='col col-6'>
                    <div className='row coll-item-btns'>
                        <div className='col col-4 col-md-3'>
                            <button className='btn btn-outline-secondary'>
                                <a href={`/create/${anim.animid}`} alt='edit'>
                                    <img src={SITE.icons.penColour} alt='edit' />
                                </a>   
                            </button>
                        </div>
                        <div className='col col-4 col-md-3'>
                            <button className='btn btn-outline-secondary'
                                onClick={handlePreview}>
                                <img src={SITE.icons.preview} alt='preview'></img>
                            </button>
                        </div>
                        <div className='col col-4 col-md-3'>
                            <button className='btn btn-outline-secondary'
                                onClick={handleDownload}>
                                <img src={SITE.icons.download} alt='download'></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={isPreviewOpen} 
                toggle={() => {setIsPreviewOpen(!isPreviewOpen)}}>
                <img src={anim.previewFile} alt={`Previewing ${anim.name}`} />
                <ModalFooter>
                    <p>{anim.name}</p>
                    <Button size='sm' 
                        onClick={() => setIsPreviewOpen(false)}
                    >Close</Button>
                </ModalFooter>
            </Modal >
            <div hidden={true}>
                <ReactP5Wrapper sketch={sketch} preview={true} anim={anim} id='animCanvas'/>
            </div>
        </div>
    );
}