import React from 'react'
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io5";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Add Product',
        path: '/addproduct',
        icon: <IoIcons.IoAddCircle />,
        cName: 'nav-text'
    },
    {
        title: 'Products',
        path: '/viewproducts',
        icon: <FaIcons.FaCartPlus/>,
        cName: 'nav-text'
    },
    {
        title: 'Log-out',
        path: '/',
        icon: <RiIcons.RiLogoutCircleFill/>,
        cName: 'nav-text'
    }
]