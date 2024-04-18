import { decodeAbiParameters } from "viem";
import { ethers } from "ethers";
import{
    SignProtocolClient,
    SpMode,
    EvmChains,IndexService
  } from "@ethsign/sp-sdk";

  import { privateKeyToAccount } from "viem/accounts";
console.log(privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY))
  //https://testnet-scan.sign.global/schema/onchain_evm_421614_0x10
//https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x2e
const schemaId = "0x10" //"0x2e"
const fullSchemaId = "onchain_evm_421614_0x10" //"onchain_evm_11155111_0x2e"

export const adminCreateAttestation = async(Person:string,Country:string,State:string,City:string)=>{
  const client = new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.arbitrumSepolia,
    account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY)
  });
  const res = await client.createAttestation({
      schemaId: schemaId,
      data: {
       Person,
       Country,
       State,
       City
      },
      indexingValue: Person.toLowerCase()
    });

    return res
}

 export const createAttestation = async(Person:string,Country:string,State:string,City:string,account:string)=>{
 
  
    const client = new SignProtocolClient(SpMode.OnChain, {
      chain: EvmChains.arbitrumSepolia,
      account: privateKeyToAccount("0x"+account)
    });
    const res = await client.createAttestation({
        schemaId: schemaId,
        data: {
         Person,
         Country,
         State,
         City
        },
        indexingValue: Person.toLowerCase()
      });

      return res
}


export const queryAttestation = async (Person:string)=>{

    const indexService = new IndexService("testnet")
    const res = await indexService.queryAttestationList({
        id: "",
        schemaId: fullSchemaId,
        attester: "",
        page: 1,
        mode: "onchain",
        indexingValue: Person.toLowerCase()
      });
   return res;   
}

export const decodeAttestation = (att:any)=>{
 /* const data = decodeAbiParameters(
    [ { components: att.schema.data, type: "tuple" } ],
    att.data
  );
  let parsedData = data;*/

  const data = decodeAbiParameters(
    att.schema.data ,
    att.data
  );
  const obj: any = {};
  data.forEach((item: any, i: number) => {
    obj[att.schema.data[i].name] = item;
  });
  let parsedData = obj;
  return parsedData
}