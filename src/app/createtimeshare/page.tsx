"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import chains from '@/chains/chains';
import Link from 'next/link'
import { useState,useEffect } from 'react';
import { Country, State, City }  from 'country-state-city';
import { timeShareTokenAddress,timeShareTokenABI,usdcTokenABI,usdcTokenAddress } from '@/contracts';
import { useAccountAbstraction } from "../../context/accountContext";
import Notification from '@/components/Notification/Notification';
import { queryAttestation ,decodeAttestation} from '@/ethsign/ethsign';

import { uploadToLightHouse } from '@/lighthouse/lighthouse';
import { ethers } from 'ethers';
import { alterTable, insertTimeshare } from '../../../tableland/tableland';
export default function CreateTimeShare() {
 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [selectedFile, setSelectedFile] = useState()
 const [country,setCountry] = useState()
 const [target,setTarget] = useState()
 const [countries,setCountries] = useState([])
 const [gotVerified,setGotVerified] = useState()
 const [profile,setProfile] = useState()
 const [state,setState] = useState()
 const [states,setStates] = useState([])
 const [city,setCity] = useState()
 const [cities,setCities] = useState([])
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
  loginWeb3Auth()

 },[])


 useEffect(()=>{
  async function getAttestation(){
     const at = await queryAttestation(ownerAddress)
     console.log(privateKey)
     console.log(at)
     if(at.rows.length ==0)
     {
      setNotificationTitle("Verify Profile")
      setNotificationDescription("Your address is not verified. You cannot create TimeShares")
      setDialogType(2) //Error
      setShow(true)
      return
     }
     else
     {
       setGotVerified(true)
       const att = decodeAttestation(at.rows[0])
       console.log(att)
       setProfile(att)
       
     }

  }

  if(ownerAddress)
    getAttestation()
 },[ownerAddress])

 // create a preview as a side effect, whenever selected file is changed
 useEffect(() => {
  if (!selectedFile) {
      setPreview(undefined)
      return
  }

  const objectUrl = URL.createObjectURL(selectedFile)
  setPreview(objectUrl)

  // free memory when ever this component is unmounted
  return () => URL.revokeObjectURL(objectUrl)
}, [selectedFile])

 const onSelectFile = (e) => {
  if (!e.target.files || e.target.files.length === 0) {
      return
  }

  // I've kept this example simple by using the first image instead of multiple
  setSelectedFile(e.target.files[0])
  setTarget(e.target.files)

}
 const createTimeShare = async(event)=>
 {
    event.preventDefault()
    if(profile?.Country != country && profile?.State != state && profile?.City != city)
    {
      console.log(profile)
      setDialogType(2) //Error
      setNotificationTitle("Create TimeShare")
      setNotificationDescription("You do not have rights to create timeshares for this location")
      setShow(true)   
      return
  
    }
    setIsSaving(true)
    
    setDialogType(3) //Info
       setNotificationTitle("Create TimeShare")
    setNotificationDescription("Creating TimeShare")
    setShow(true)   
    const name = document.getElementById("name")?.value
    const shares = document.getElementById("shares").value
    const price = document.getElementById("price").value 
    const description = document.getElementById("description").value
    const upload = await uploadToLightHouse(target)
    const photo = `https://gateway.lighthouse.storage/ipfs/${upload.data.Hash}`
    const _signer = web3Provider?.getSigner()
    const timeShareContract = new ethers.Contract(
      timeShareTokenAddress.get(chainId),
      timeShareTokenABI,
      _signer
    );
      console.log(shares)
      console.log(name)
      console.log(chainId)
      console.log(timeShareTokenAddress.get(chainId))
      console.log(ownerAddress)
    try {

      let tx1 = await timeShareContract.callStatic.fractionalise( name,"TS",18,shares,ownerAddress,ownerAddress)
      let transaction = await timeShareContract.fractionalise( name,"TS",18,shares,ownerAddress,ownerAddress)
      await transaction.wait();
      // Wait for the event promise to be resolved
      // Access the transaction receipt for more information
    const receipt = await _signer.provider.getTransactionReceipt(transaction.hash);
   
    // Access event data from the receipt (replace 'YourEventName' with your actual event name)
    console.log(receipt)
    const iface = new ethers.utils.Interface(timeShareTokenABI);
    console.log(iface)

    const events = iface.parseLog(receipt.logs[2]);
   console.log(events)
   const timeshareId = events.args[0].toNumber();
   await insertTimeshare(timeshareId,name,photo,description,country,state,city,chainId.toString(),parseInt(shares),parseFloat(price),ownerAddress)

       console.log(events.args); // Access event arguments
    setDialogType(1) //Success
    setNotificationTitle("Create TimeShare")
    setNotificationDescription("TimeShare Successfully Created")
    setShow(true)   

    }catch(error)
    {
      if (error.code === "TRANSACTION_REVERTED") {
        console.log("Transaction reverted");
        // let revertReason = ethers.utils.parseRevertReason(error.data);
        setNotificationDescription("Reverted");
      } else if (error.code === "ACTION_REJECTED") {
        setNotificationDescription("Transaction rejected by user");
      } else {
        console.log(error);
        //const errorMessage = ethers.utils.revert(error.reason);
        setNotificationDescription(
          `Transaction failed with error: ${error.reason}`
        );
      }
      setDialogType(2); //Error
      setNotificationTitle("Create TimeShare");
      setIsSaving(false)
      setShow(true);

    }
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
        <form className="p-8 sm:p-10"  onSubmit={ createTimeShare}>
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
              <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                    <input
                      disabled={isSaving }
                      required={!selectedFile ? true: false}
                      type="file"
                      name="eventImage"
                      id="eventImage"
                      className="sr-only"
                      onChange={onSelectFile}
                    />
                    <label
                      for="eventImage"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={preview ? preview: '/images/default-image.jpg'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2">
                    <button disabled={isSaving }
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Save TimeShare
                    </button>
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-5 pt-2">
                    <p className="text-xl font-bold text-white">
                      TimeShare Details
                    </p>
                  </div>
                  <div className="mb-5">
                        <label
                          for="name"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Name
                        </label>
                        <input
                        disabled={isSaving }
                          required   
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter Name"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>                  <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="shares"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          No. Shares
                        </label>

                        <select 
        id="shares"
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
      >
        {[...Array(51)].map((_, index) => (
          <option key={index + 2} value={index + 2}>
            {index + 2}
          </option>
        ))}
      </select>
                       
                      </div>
                    </div>
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="price"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Price
                        </label>
                        <input
                        disabled={isSaving }
                          required   
                          type="number"
                          name="price"
                          id="price"
                          placeholder="Enter Price"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>
                    </div>
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
             
                 
                  <div className="mb-5">
                    <label
                      for="description"
                      className="mb-2 block text-base font-medium text-white"
                    >
                      Description
                    </label>
                    <textarea
                      disabled={isSaving }
                      required
                      rows="10"
                      name="description"
                      id="description"
                      placeholder="Type timeshare description"
                      className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                    ></textarea>
                  </div>
             
                 
                 
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
