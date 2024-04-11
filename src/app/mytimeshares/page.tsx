"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import chains from '@/chains/chains';
import Link from 'next/link'
import { useState } from 'react';
export default function TimeShare() {
  const [timeshares,setTimeShares] = useState([{id:1,name:"Electric Bike",price:100,shares:10,status:"Available"
  ,image:"/images/timesharelogo2.png",owner:"Dominic Hackett",chain:chains[0]}
  ,{id:2,name:"Electric Bike",price:100,shares:10,status:"Available",image:"/images/timesharelogo2.png",owner:"Dominic Hackett",chain:chains[1]}
  ,{id:3,name:"Electric Bike",price:100,shares:10,status:"Available",image:"/images/timesharelogo2.png",owner:"Dominic Hackett",chain:chains[2]}
  ,{id:4,name:"Electric Bike",price:100,shares:10,status:"Available",image:"/images/timesharelogo2.png",owner:"Dominic Hackett",chain:chains[3]}])
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
      className= "  relative z-10 overflow-hidden bg-cover bg-top bg-no-repeat pt-[150px] pb-24"
          >
      <div
        className="grade absolute left-0 top-0 -z-10 h-full w-full"
       
        
      ></div>      
      <div
        className="absolute left-0 top-0 -z-10 h-full w-full"
      
      ></div>
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
         
        <div className="mb-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {timeshares.map((timeshare) => (
                  <div key={timeshare.id} className=' bg-bg-color p-4 rounded-lg border border-dashed border-[#A1A0AE]'>
                  <button  onClick={()=>viewItem(timeshare)} className="cursor-pointer group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg sm:aspect-h-3 sm:aspect-w-2">
                      <img
                        src={timeshare.image}
                        alt={timeshare.name}
                        className="h-[300px]  w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    </button>

                    <div className="flex items-center mt-4 ">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img crossOrigin  className="cursor-pointer  h-8 w-8 rounded-full" 
                        src={timeshare.chain.icon} alt="" />
                      </div>
                      <div className="mt-2 mr-2">
                      <div  className="mb-4 cursor-pointer text-sm font-medium text-white">{timeshare.chain.label}</div>

                         </div>
                    </div> 
                 
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-white">
                      <h3>{timeshare.name}</h3>
                      <p>${timeshare.price}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-white">
                      <h3>Shares</h3>
                      <p>{timeshare.shares}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-white">
                      <h3>Available Shares</h3>
                      <p>{timeshare.shares}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-base font-medium text-white">
                      <h3>Status</h3>
                      <p>{timeshare.status}</p>
                    </div>
                    
                  </div>
                ))}
              </div>
        </div>
      </div>

      
    </section>
    <Footer />
     </main>
     </>
  )
}
