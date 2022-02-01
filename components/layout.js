import React, { useState } from 'react';
import Board from './board';
import SideNav from './sidenav';
import TopNav from './topnav';
import styles from "../styles/layout.module.scss";
import Collapse from '@mui/material/Collapse';

function Layout () {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='app_layout'>
            <div className='app_sidebar'>
                <SideNav/>
            </div>
            <div className='app_body'>
                <div className='app_topbar'>
                    <p>ello</p>
                </div>
                <div className='app_content'>
                    <Board/>
                </div>
            </div>
        </div>
    )
}

export default Layout;