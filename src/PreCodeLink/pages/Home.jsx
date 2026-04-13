import React from 'react'
import Hero from '../section/Hero'
import Features from '../section/Features'
import Projects from '../section/Projects'
import Services from '../section/Servicess'
import CTA from '../section/CTA'
import Layout from '../layouts/Layout'
import WhatsAppFloat from '../components/WhatsappFloat'

const Home = () => {
  return (
    <>
    <Layout>
        <Hero />
        <Services />
        <Features />
        <Projects />
        <CTA />
        <WhatsAppFloat />
    </Layout>
    </>
  )
}

export default Home
