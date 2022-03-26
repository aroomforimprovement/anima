import React from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';

TopBarProgress.config({
    barColors:{
        "0": "#fff",
        "1.0": "#afa"
    },
    shadowBlur: 5
});

export const TopProgressBar = ({show}) => {
    return(
        <div> 
            {show && <TopBarProgress />}
        </div>
        
    )
}

export const ViewerProgressBar = ({max, now}) => {
    return(
        <div>
            <progress max={max} value={now}/>
        </div>
    )
} 