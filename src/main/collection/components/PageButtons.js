import { Button } from "react-bootstrap";
import { useCollectionContext } from "../Collection";

export const PageButtons = () => {

    const {collectionState, setCollectionState} = useCollectionContext();

    const PageUp = () => {
        const pageUp = () => {
            if(collectionState?.anims.length >= 10){
                setCollectionState({type: 'PAGE', data: collectionState.page+1});
            }else{
                setCollectionState({type: 'PAGE', data: 0});
            }
        }
        return(
            <button
                type="button"
                className='page-btn'
                onClick={pageUp} 
            >{'>'}</button>
        )
    }
    const PageDown = () => {
        const pageDown = () => {
            if(collectionState.page > 0){
                setCollectionState({type: 'PAGE', data: collectionState.page-1});
            }
        }
        return(
            <button
                type="button"
                className='page-btn'
                onClick={pageDown}
            >{'<'}</button>
        )
    }

    const Page = () => {
        return(
            <div className='page-btn page'>
                {collectionState.page+1}
            </div>
        )
    }

    return(
        <div id='page-up' 
            className="page-btns">
            <PageDown/>
            <Page/>
            <PageUp/>
        </div>
    )

}