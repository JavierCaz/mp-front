import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'

const Layout = (props) => {
    /*----PROPS----*/
    const {
        colorMode
    } = props

    return (
        <>
            <Header colorMode={colorMode} />
            <Outlet />
        </>
    )
}

export default Layout
