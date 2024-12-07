import React from 'react'
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as FaIcons from "react-icons/fa";

export const SidebarData = [
    {
        title: 'Home',
        path: '/user',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Profile',
        path: '/user/profile',
        icon: <FaIcons.FaUser/>,
        cName: 'nav-text'
    },
    {
        title: 'Log-out',
        path: '/',
        icon: <RiIcons.RiLogoutCircleFill/>,
        cName: 'nav-text'
    }
]