import React from 'react';
import { SITE } from '../../../shared/site';
import { Loading } from '../../../common/Loading';
import { Div } from '../../../common/Div';

export const Buttons = ({anim, user, handleDelete, handleView, handleDownload, isViewerOpen}) => {
    
    const Edit = ({animid}) => {
        return(
            <div className='col col-3'>
                <button className='btn btn-outline-secondary'>
                    <a href={`/create/${animid}`} alt='edit'>
                        <img src={SITE.icons.penColour} alt='edit' />
                    </a>   
                </button>
            </div>
        );
    }

    const View = ({isViewerOpen, handleView}) => {
        return(
            <div className='col col-3'>
                <button className='btn btn-outline-secondary'
                    onClick={handleView}>
                    {isViewerOpen ? <Loading /> : <img src={SITE.icons.preview} alt='preview'></img>}
                </button>
            </div>
        )
    }

    const Download = ({handleDownload}) => {
        return(
            <div className='col col-3'>
                <button className='btn btn-outline-secondary'
                    onClick={handleDownload}>
                        <img src={SITE.icons.download} alt='download'></img>
                </button>
            </div>
        );
    }

    const Delete = ({handleDelete}) => {
        return(
            <div className='col col-3'>
                <button className='btn btn-outline-secondary'
                    onClick={handleDelete}>
                    <img src={SITE.icons.wipe} alt='delete'></img>
                </button>
            </div>
        );
    }
    
    return(
        <div className='row coll-item-btns mt-1 mb-1'>
            { user && anim.userid === user.userid
            ? <Edit animid={anim.animid}/> : <Div/>}
            <View isViewerOpen={isViewerOpen} handleView={handleView} />
            <Download handleDownload={handleDownload} />
            {user && anim.userid === user.userid
            ? <Delete handleDelete={handleDelete} /> : <Div/>}
        </div>
    )
}