import React, { useEffect } from 'react'
import AboutUsHeader from '../../components/AboutUs/AboutUs'
import TestimonialsPage from '../../components/AboutUs/TestimonialsPage'
import FAQ from '../../components/AboutUs/FAQ'
import ShopLocation from '../../components/AboutUs/ShopLocation'

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  return (
    <div >
        <AboutUsHeader />
        <TestimonialsPage />
        <FAQ />
        <ShopLocation />
    </div>
  )
}

export default AboutUsPage