"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import chains from '@/chains/chains';
import Link from 'next/link'
import { useState,useEffect } from 'react';
import { Country, State, City }  from 'country-state-city';
import { useAccountAbstraction } from "../../../context/accountContext";
import { queryMyTimeShare } from '../../../../tableland/tableland';
import Notification from '@/components/Notification/Notification';
import { timeShareTokenAddress,timeShareTokenABI,usdcTokenABI,usdcTokenAddress } from '@/contracts';
import { ethers } from 'ethers';
import { insertListing } from '../../../../tableland/tableland';

export default function ViewTimeShare({params}) {
 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [selectedFile, setSelectedFile] = useState()
 const [country,setCountry] = useState([])
 const [countries,setCountries] = useState([])
 const [gotTimeShare,setGotTimeShare] = useState()
 const [state,setState] = useState()
 const [states,setStates] = useState([])
 const [city,setCity] = useState()
 const [cities,setCities] = useState([])
 const [timeshare,setTimeShare] = useState()

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
  async function getTimeShare(){
    console.log(params)
    const id = params.id
    const underscoreIndex = id.indexOf('_');
    if (underscoreIndex !== -1 && underscoreIndex > 0 && underscoreIndex < id.length - 1) {
      // Get the digit before and after underscore
      const timeshareId = parseInt(id[underscoreIndex - 1]);
      const chain = parseInt(id[underscoreIndex + 1]);
      
      const _timeshare = await queryMyTimeShare(ownerAddress,chain,timeshareId);
      if(_timeshare.length == 0)
      {
        setDialogType(2) //Error
        setNotificationTitle("View TimeShare")
        setNotificationDescription("TimeShare not found")
        setShow(true)
        return
      }
      
      setTimeShare(_timeshare[0])
      const _states = State.getStatesOfCountry(_timeshare[0].country)
      const _cities = City.getCitiesOfState(_timeshare[0].country,_timeshare[0].state)
      setCountry(_timeshare[0].country)     
      setState(_timeshare[0].state)
      setCity(_timeshare[0].city)
      setCities(_cities)
      setStates(_states)
      console.log(_timeshare)

    }
    else
    {
       return
    }    
      
  }

  if(ownerAddress)
    getTimeShare()

 },[ownerAddress])

 useEffect(()=>{
   loginWeb3Auth()
 },[])
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
}
 const listTimeShare = async(event:any)=>
 {
     event.preventDefault()
     if(chainId != timeshare.chain) 
     {
       
       setDialogType(2) //Error
       setNotificationTitle("List TimeShare")
       setNotificationDescription("Eror wrong chain selected.")
       setShow(true)
       return
     }

     setIsSaving(true)
    
    setDialogType(3) //Info
       setNotificationTitle("Create TimeShare")
    setNotificationDescription("Creating TimeShare")
    setShow(true)   
    const _signer = web3Provider?.getSigner()
    const timeShareContract = new ethers.Contract(
      timeShareTokenAddress.get(chainId),
      timeShareTokenABI,
      _signer
    );
    
    
        
    try {
      const shares = document.getElementById("sharesToList").value
      const price = ethers.utils.parseEther(timeshare.price.toString())
      const token = await timeShareContract.getTokenAddress(timeshare.id);
      console.log(token)
      alert(token)
      const tokenContract = new ethers.Contract(
        token,
        usdcTokenABI,
        _signer
      );
      console.log(shares)
      let tx = await tokenContract.approve( timeShareTokenAddress.get(chainId),ethers.utils.parseEther(shares.toString()))
      await tx.wait()   
      alert("Love")
      let tx1 = await timeShareContract.callStatic.list( timeshare.id,shares,timeshare.price)
      let transaction = await timeShareContract.list( timeshare.id,shares,price)
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
   const listingId = events.args[1].toNumber();
   const datelisted = new Date().getTime()
   await insertListing(listingId,timeshare.id,shares,shares,ownerAddress,datelisted)
       console.log(events.args); // Access event arguments
    setDialogType(1) //Success
    setNotificationTitle("List TimeShare")
    setNotificationDescription("TimeShare Successfully Listed")
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
        <form className="p-8 sm:p-10"  onSubmit={ listTimeShare}>
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
              <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                    
                    <label
                      for="eventImage"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={timeshare?.photo ?  timeshare?.photo: '/images/timesharelogo2.png'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2 flex items-center justify-between">
                    <button disabled={isSaving }
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        List TimeShare
                    </button>
                   <input type='number' id="sharesToList" defaultValue={10} min={1}                          
                   className="ml-2 w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
/>
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

                  <div className="flex items-center mt-4 ">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img crossOrigin  className="cursor-pointer  h-8 w-8 rounded-full" 
                        src={chains[timeshare?.chain ? timeshare.chain:0].icon} alt="" />
                      </div>
                      <div className="mt-2 mr-2">
                      <div  className="mb-4 cursor-pointer text-sm font-medium text-white">{chains[timeshare?.chain ? timeshare.chain:0].label} </div>

                         </div>
                    </div> 
                 
                  <div className="mb-5">
                        <label
                          for="name"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Name
                        </label>
                        <input
                        disabled={true }
                          required   
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Enter Name"
                          value={timeshare?.name}
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
        disabled={true}
        value={timeshare?.shares}
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
                        disabled={true }
                          required   
                          value={timeshare?.price}
                          type="number"
                          name="price"
                          id="price"
                          placeholder="Enter Price"
                          className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
                        />
                      </div>
                    </div>
                 
                    <div className="w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="sharesOwned"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          No. Shares Owned
                        </label>

                        <select 
        id="sharesOwned"
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
        value={timeshare?.shares}
        disabled={true}
      >
        {[...Array(51)].map((_, index) => (
          <option key={index + 2} value={index + 2}>
            {index + 2}
          </option>
        ))}
      </select>
                       
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
        value={timeshare?.country}
        disabled={true}
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
       disabled={true}
       value={timeshare?.state}
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
       disabled={true}
       value={timeshare?.city}
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
                      disabled={true }
                      value={timeshare?.description}
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
