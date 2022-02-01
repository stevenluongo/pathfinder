import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/global-context';
import Board from './board';
import SideNav from './sidenav';
import TopNav from './topnav';

function Layout () {
    return (
        <div className='app_layout'>
            <div className='app_sidebar'>
                <SideNav/>
            </div>
            <div className='app_body'>
                <div className='app_topbar'>
                    <TopNav/>
                </div>
                <div className='app_content'>
                    <Board/>
                </div>
            </div>
        </div>
    )
}

export default Layout;