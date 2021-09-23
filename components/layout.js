import React from 'react';
import Board from './board';
import SideNav from './sidenav';
import TopNav from './topnav';
import styles from "../styles/layout.module.scss";

function Layout () {
    return (
        <>
        <TopNav/>
        <div className={styles.layout}>
            <Board/>
            <SideNav/>
        </div>
        </>
    )
}

export default Layout;