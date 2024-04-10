"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';

import Link from 'next/link'
export default function Home() {
  return (
    <>
      <Head>
      <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans&display=swap" rel="stylesheet"/>   
     <title>Time Share - Fractional Ownership</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-black"
       
     >
         <Header/>

     <section
      id="home"
      className= " bg-[url('/images/timesharelogo2.jpg')] relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div className="mb-12 max-w-[570px] lg:mb-0">
              <h1
                className="mb-4 text-[40px] font-bold leading-tight text-white md:text-[50px] lg:text-[40px] xl:text-[46px] 2xl:text-[50px] sm:text-[46px]"
              >
               
               Timeshare - Fractional Ownership
                             </h1>
              <p
                className="mb-8 text-lg font-medium leading-relaxed text-body-color md:pr-14"
              >
           "TimeShare" is a revolutionary dApp that brings fractional ownership to everyday high-value items. Through blockchain technology, users can collectively own luxury cars, vacation homes, electronics, and more. By purchasing fractional shares, individuals can access assets beyond their financial reach, promoting sustainable consumption and community collaboration.





</p>
         <div className="flex flex-wrap items-center">
                <Link
                  href="/timeshares"
                  className="mr-5 mb-5 inline-flex items-center justify-center rounded-md border-2 border-primary bg-primary py-3 px-7 text-base font-semibold text-white transition-all hover:bg-opacity-90"
                >
                  TimeShares
                </Link>
                <Link
                  href="/about"
                  className="mb-5 inline-flex items-center justify-center rounded-md border-2 border-white py-3 px-7 text-base font-semibold text-white transition-all hover:border-primary hover:bg-primary"
                >
                  About
                </Link>
              </div>
            </div>
          </div>

        
        </div>
      </div>

      
    </section>
    <Footer />
     </main>
     </>
  )
}
