import React from 'react'
import Hero from '../components/Hero'
import WhyUs from '../components/WhyUs'
import Pricing from '../components/Pricing'
import PayoutProof from '../components/PayoutCert'
import Layout from '../layout/Layout'
import Testimonial from '../components/Testimonial'

const Home = () => {
  return (
    <>
   <Layout>
    <Hero />
    <WhyUs />
    <Pricing />
    <Testimonial />
    <PayoutProof />
   </Layout>
    </>
  )
}

export default Home
