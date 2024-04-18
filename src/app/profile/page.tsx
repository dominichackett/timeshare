"use client"
import Head from 'next/head'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image';
import chains from '@/chains/chains';
import Link from 'next/link'
import { useState,useEffect,useRef } from 'react';
import { Country, State, City }  from 'country-state-city';
import { useAccountAbstraction } from "../../context/accountContext";
import { queryProfile ,insertProfile,updateProfile} from '../../../tableland/tableland';
import Notification from '@/components/Notification/Notification';
import { uploadToLightHouse,uploadFile } from '@/lighthouse/lighthouse';
export default function Profile() {
 const [isSaving,setIsSaving] = useState()
 const [preview,setPreview] = useState()
 const [selectedFile, setSelectedFile] = useState()
 const [target,setTarget] = useState()
 const filename = useRef()

 const [country,setCountry] = useState()
 const [countries,setCountries] = useState([])

 const [state,setState] = useState()
 const [states,setStates] = useState([])
 const [city,setCity] = useState()
 const [cities,setCities] = useState([])
 const [profileExist,setProfileExist] = useState(false)
 const [gotProfile,setGotProfile] = useState(false)
 const [profile,setProfile] = useState({})
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
  async function getProfile()
  {
     const _profile = await queryProfile(ownerAddress)
     if(_profile.length > 0)
    {
      console.log(_profile)

      const _states = State.getStatesOfCountry(_profile[0].country)
      const _cities = City.getCitiesOfState(_profile[0].country,_profile[0].state)
      setCountry(_profile[0].country)     
      setState(_profile[0].state)
      setCity(_profile[0].city)
      setCities(_cities)
      setStates(_states)
      document.getElementById("description").value = _profile[0].description
      document.getElementById("name").value= _profile[0].name
       setGotProfile(true)
       setProfileExist(true)
       setProfile(_profile[0])
        const image =  await fetch(_profile[0].photo)
       if(image.ok)
       {
            console.log(image)
             setSelectedFile(await image.blob())
             // const objectUrl = URL.createObjectURL(await image.blob())
             //setPreview(objectUrl)
       }   
      else
    {
      setGotProfile(true)
      setProfileExist(false)
    }   
  }
} 
  
  if(ownerAddress)
  getProfile()
  setCountries(Country.getAllCountries())
  console.log(City.getCitiesOfCountry("TT"))

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
  filename.current = e.target.files[0].name
  setTarget(e.target.files)

}
 const saveProfile = async(event:any)=>
 {
   event.preventDefault()
   setIsSaving(true)
   setNotificationTitle("Save Profile")
    setNotificationDescription("Saving Profile.")
    setDialogType(3) //Information
    setShow(true)     
   
   try{
    let photo
    if(filename.current)
    {
    const upload = await uploadToLightHouse(target)
   console.log(upload)
      photo = `https://gateway.lighthouse.storage/ipfs/${upload.data.Hash}`
    }else
    {
       photo = profile.photo 
    }
     const description = document.getElementById("description").value
     const name = document.getElementById("name").value
    if(profileExist)
    {
       await updateProfile(ownerAddress,name,photo,description,country,state,city)
    }else
    {
       await insertProfile(ownerAddress,name,photo,description,country,state,city)
    }  

    setNotificationTitle("Save Profile")
    setNotificationDescription("Profile saved succesfully")
    setDialogType(1) //Success
    setShow(true)    
    setIsSaving(false)
   }catch(error)
   {
    setNotificationTitle("Save Profile")
    setNotificationDescription("Error updating profile")
    setDialogType(2) //Error
    setShow(true)    
    setIsSaving(false)
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
        <form className="p-8 sm:p-10"  onSubmit={ saveProfile}>
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
                     <img src={preview ? preview: '/images/profile.jpg'}/>
                    </label>
                  </div>

            

                  <div className="rounded-md bg-[#4E4C64] py-4 px-8">
                   
                  <div className="pt-2 ">
                    <button disabled={isSaving }
                      className="hover:shadow-form w-full rounded-md bg-primary py-3 px-8 text-center text-base font-semibold text-white outline-none"
                    >
                        Save Profile 
                                           </button>
                   
                  </div>                    
                   
                  </div>
                </div>
              </div>
              <div className="w-full px-5 lg:w-7/12 xl:px-8">
                <div>
                <div className="mb-5 pt-2">
                    <p className="text-xl font-bold text-white">
                      Profile Details
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
                        <select onChange={countryChanged} value={country}
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
        onChange={cityChanged}
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
                      placeholder="Type profile description"
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
