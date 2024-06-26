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
import { queryTimeShare,insertBooking } from '../../../../tableland/tableland';
import { v4 as uuidv4 } from 'uuid';
import Notification from '@/components/Notification/Notification';
export default function BookTimeShare({params}) {
 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [selectedFile, setSelectedFile] = useState()
 const [country,setCountry] = useState([])
 const [countries,setCountries] = useState([])
 const [bookings,setBookings] = useState([{id:1,name:"Dominic Hackett", week:1}])
 const [state,setState] = useState([])
 const [states,setStates] = useState([])
 const [city,setCity] = useState([])
 const [cities,setCities] = useState([])
 const [year] = useState(new Date())
 const [gotTimeShare,setGotTimeShare] = useState()
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
 const bookTimeShare = async(event:any)=>
 {

      event.preventDefault()
   try    
    { 
      const _id = uuidv4()
      setDialogType(3)  //Info
      setNotificationTitle("Book TimeShare")
      setNotificationDescription("Booking TimeShare")
      setShow(true)   
     const week =  document.getElementById("week").value 
    await insertBooking(_id,ownerAddress,week,year,timeshare.id,chainId)
    setDialogType(1)  //Success
    setNotificationTitle("Book TimeShare")
    setNotificationDescription("TimeShare Successfully booked")
    setShow(true)
    }catch(error)
    {
      setDialogType(2)  //Error
      setNotificationTitle("Book TimeShare")
      setNotificationDescription("Error booking TimeShare")
      setShow(true)
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
      
      const _timeshare = await queryTimeShare(timeshareId,chain);
      if(_timeshare.length == 0)
      {
        setDialogType(2) //Error
        setNotificationTitle("Booking TimeShare")
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
    }    
      
  }

  if(ownerAddress)
    getTimeShare()

 },[ownerAddress])

 useEffect(()=>{
   loginWeb3Auth()
 },[])
 const getBookings = async(event:any)=>{
    
   alert(event.target.value)
   return
    const _week = document.getElementById("week").value
    const _bookings = await queryBooking(1,year,_week,chainId);
    setBookings(_bookings)
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
        <form className="p-8 sm:p-10"  onSubmit={ bookTimeShare}>
            <div className="-mx-5 flex flex-wrap xl:-mx-8">
              <div className="w-full px-5 lg:w-5/12 xl:px-8">
              <div className="mb-12 lg:mb-0">
                  <div className="mb-8">
                    
                    <label
                      for="eventImage"
                      className="cursor-pointer relative flex h-[480px] min-h-[200px] items-center justify-center rounded-lg border border-dashed border-[#A1A0AE] bg-[#353444] p-12 text-center"
                    >
                     <img src={timeshare?.photo ? timeshare.photo: '/images/timesharelogo2.png'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2 flex items-center justify-between">
                    <button disabled={isSaving }
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Book TimeShare
                    </button>
                   <input type='number' id="year" defaultValue={year.getFullYear()} min={year?.getFullYear()} onChange={getBookings}                          
                   className="ml-2 w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
/>
                  </div>     
                  <div className="mt-2 w-full px-3 md:w-1/2">
                      <div className="mb-5">
                        <label
                          for="week"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Week
                        </label>

                        <select 
        id="week"
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
      >
        {[...Array(52)].map((_, index) => (
          <option key={index} value={index}>
            {index + 1}
          </option>
        ))}
      </select>
                       
                      </div>
                    </div>               
                      <div className="mb-5">
                        <label
                          for="bookings"
                          className="mb-2 block text-base font-medium text-white"
                        >
                          Bookings
                        </label>

                        <select 
        id="bookings"
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
      >
        {bookings.map((booking, index) => (
          <option key={booking.id} value={booking.id}>
            {booking.name} - Week: {booking.week}
          </option>
        ))}
      </select>
                       
                      
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
                        src={chains[chainId].icon} alt="" />
                      </div>
                      <div className="mt-2 mr-2">
                      <div  className="mb-4 cursor-pointer text-sm font-medium text-white">{chains[chainId].label} </div>

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
                          value={timeshare?.name}
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
                        disabled={isSaving }
                          required   
                          type="number"
                          name="price"
                          id="price"
                          value={timeshare?.price}
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
        className="w-full rounded-md border border-stroke bg-[#353444] py-3 px-6 text-base font-medium text-body-color outline-none transition-all focus:bg-[#454457] focus:shadow-input"
       value={country}
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
       value={state}
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
        value={city}
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
                      value={timeshare?.description}
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
