import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatBotButton from "./ChatBotButton";

const Layout = ({children}) => {
  return (
    <>
    <Navbar />
    {children}
    <Footer />
    <ChatBotButton />
    </>
  )
}

export default Layout
