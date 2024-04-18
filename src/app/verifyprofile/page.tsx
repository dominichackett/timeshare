"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import chains from '@/chains/chains';
import Link from 'next/link'
import { useAccountAbstraction } from "../../context/accountContext";
import { queryAttestation ,createAttestation,adminCreateAttestation,decodeAttestation} from '@/ethsign/ethsign';
import { ethers } from 'ethers';

import { useState,useEffect } from 'react';
import { Country, State, City }  from 'country-state-city';
import Notification from '@/components/Notification/Notification';
export default function CreateTimeShare() {
 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [country,setCountry] = useState()
 const [countries,setCountries] = useState([])

 const [state,setState] = useState()
 const [states,setStates] = useState([])
 const [city,setCity] = useState()
 const [cities,setCities] = useState([])
 const [gotVerified,setGotVerified] = useState()
  // NOTIFICATIONS functions
  const [notificationTitle, setNotificationTitle] = useState();
  const [notificationDescription, setNotificationDescription] = useState();
  const [dialogType, setDialogType] = useState(1);
  const [show, setShow] = useState(false);
  const close = async () => {
setShow(false);
};

const {
  ownerAddress,
  safes,
  chainId,
  privateKey,
  isAuthenticated,
  web3Provider,
  loginWeb3Auth,
  logoutWeb3Auth,
  setChainId,

  // ...other context values and functions you need
} = useAccountAbstraction();

 useEffect(()=>{
  setCountries(Country.getAllCountries())
  console.log(City.getCitiesOfCountry("TT"))
  loginWeb3Auth();

 },[])

 
 useEffect(()=>{
  async function getAttestation(){
     const at = await queryAttestation(ownerAddress)
     console.log(privateKey)
     console.log(at)
     if(at.rows.length ==0)
     {
      setNotificationTitle("Verify Profile")
      setNotificationDescription("Your address is not verified.")
      setDialogType(2) //Error
      setShow(true)
      return
     }
     else
     {
       setGotVerified(true)
       const att = decodeAttestation(at.rows[0])
       console.log(att)
       
     }

  }

  if(ownerAddress)
    getAttestation()
 },[ownerAddress])

 
const adminVerify = async()=>{
  const person = document.getElementById("ethaddress").value
 
  const res = await adminCreateAttestation(person,country,state,city)
  console.log(res)
  
}

 const verifyProfile = async(event:any)=>
 {
     event.preventDefault()
     const person = document.getElementById("ethaddress").value
     
     if(!ethers.utils.isAddress(person))
     {
        setNotificationTitle("Verify Profile")
        setNotificationDescription("Invalid Ethereum Address")
        setDialogType(2) //Error
        setShow(true)
        return
     }

     setNotificationTitle("Verify Profile")
     setNotificationDescription("Verifying Profile")
     setDialogType(3) //Info
     setShow(true)
    
     console.log(privateKey)
     const wallet = new ethers.Wallet(privateKey)
  console.log(wallet.privateKey)
  console.log(wallet.getAddress())
     //const privateKey32Bytes = privateKey64Bytes.substring(0, 64);

     const res = await createAttestation(person,country,state,city,privateKey)
     setNotificationTitle("Verify Profile")
     setNotificationDescription("Account Successfully Verified")
     setDialogType(1) //Success
     setShow(true)
      
 }


 const countryChanged = (event:any)=>{
     const _states = State.getStatesOfCountry(event.target.value)
      setStates(_states)
      setCountry(event.target.value)
    } 

  
 const stateChanged = (event:any)=>{
  const _cities = City.getCitiesOfState(country,event.target.value)
  console.log(event.target.value)
  console.log(_cities)
   setCities(_cities)
   setState(event.target.value)

 }   


 const cityChanged = (event:any)=>{
   setCity(event.target.value)

 }   

 
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
      <div
          className="relative  overflow-hidden rounded-xl bg-bg-color"
        >       
        <form className="p-8 sm:p-10"  onSubmit={ verifyProfile}>
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
              <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                  
                    <label
                      for="eventImage"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={preview ? preview: '/images/sign.webp'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2">
                    <button disabled={isSaving || !gotVerified}
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Verify Profile
                    </button>

                    <button 
                     hidden={true}
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    type='button'
                    onClick={()=>adminVerify()}
                   >
                      Admin Verify
                    </button>
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-5 pt-2">
                    <p className="text-xl font-bold text-white">
                      Verify Profile
                    </p>
                  </div>
                  <div className="mb-5">
                        <label
                          for="ethaddress"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          ETH Address
                        </label>
                        <input
                        disabled={isSaving }
                          required   
                          type="text"
                          name="ethaddress"
                          id="ethaddress"
                          placeholder="Enter ETH Address"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>                  <div className="-mx-3 flex flex-wrap">
                    
                    
                  </div>

                  <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="country"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Country
                        </label>
                        <select onChange={countryChanged}
        id="countries"
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
 
      >
        <option value="">Country</option>
        {countries.map((_country) => (
          <option key={_country.isoCode} value={_country.isoCode}>
            {_country.name} 
          </option>
        ))}
      </select>                       </div>
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="states"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          States
                        </label>
                        <select onChange={stateChanged}
        id="states"
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
 
      >
        <option value="">State</option>
        {states.map((_state) => (
          <option key={_state.isoCode} value={_state.isoCode}>
            {_state.name} {_state.isoCode}
          </option>
        ))}
      </select>                       </div>
                    </div>
                  </div>
     
     
                  <div className="mb-5">
                        <label
                          for="cities"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          City
                        </label>
                        <select 
        id="cities"
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
       onChange={cityChanged}
      >
        <option value="">City</option>
        {cities.map((_city,index) => (
          <option key={index} value={index}>
            {_city.name} 
          </option>
        ))}
      </select>                       </div>
             
                 
               
                 
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      
    </section>
    <Notification
        type={dialogType}
        show={show}
        close={close}
        title={notificationTitle}
        description={notificationDescription}
      />
    <Footer />
     </main>
     </>
  )
}
