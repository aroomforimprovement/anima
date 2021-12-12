import React from 'react';
import { SITE } from '../shared/site';

const Footer = () => {
    return(
        <footer hidden={true} className='site-footer'>
            <p><a href='/'>{SITE.name}</a></p>
        </footer>
    );
}

export default Footer;