import Footer from '@/components/homeComponents/Footer'
import Header from '@/components/homeComponents/Header'
import MainBanner1 from '@/components/homeComponents/MainBanner1'
import DepartmentSection from '@/components/homeComponents/MainBanner2'
import MainBanner3 from '@/components/homeComponents/MainBanner3'
import MainBanner5 from '@/components/homeComponents/MainBanner5'
import React from 'react'

const Home = () => {
  return (
    <section>
        <Header/>
        <MainBanner1/>
        <DepartmentSection/>
        <MainBanner3/>
        <MainBanner5/>
        <Footer/>
    </section>
  )
}

export default Home