import lighthouse from '@lighthouse-web3/sdk'
//import { create } from '@web3-storage/w3up-client'
 
//const client = await create()
export const uploadToLightHouse = async(file:any)=>{
    const uploadResponse = await lighthouse.upload(
        file, 
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,false,null)
      

  return uploadResponse
}


/*export const uploadFile = async(file:any)=>{

  const client = await create()
  await client.setCurrentSpace(process.env.NEXT_PUBLIC_WEB3_STORAGE)
  const cid = await client.uploadFile(file)
  return cid



}*/
