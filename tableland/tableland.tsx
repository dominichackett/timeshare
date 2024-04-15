import { Database } from "@tableland/sdk";
import {ethers} from "ethers"
export const timesharesTable ="timeshares_314159_860"
export const listingsTable ="listings_314159_857"
export const ownedtimesharesTable = "ownedtimeshares_314159_861"

export const profilesTable = "profiles_314159_858"

const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY)


const provider = new ethers.providers.JsonRpcProvider(
    "https://api.calibration.node.glif.io/rpc/v1"
  );

const signer = wallet.connect(provider);

const db = new Database({signer})  


export const insertProfile =async (id:string,name:string,photo:string,description:string,country:string,state:string,city:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`INSERT INTO ${profilesTable} (id, name,photo,description,country,state,city) VALUES ( ?,?,?,?,?,?,?);`)
.bind(id,name,photo,description,country,state,city)
.run();

// Wait for transaction finality
//await insert.txn?.wait();
}


export const insertTimeshare =async (id:number,name:string,photo:string,description:string,country:string,state:string,city:string,chain:string,shares:number,price:number,owner:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`INSERT INTO ${timesharesTable} (id, name,photo,description,country,state,city,chain,shares,price,owner) VALUES ( ?,?,?,?,?,?,?,?,?,?,?);`)
.bind(id,name,photo,description,country,state,city)
.run();

// Wait for transaction finality
//await insert.txn?.wait();
}


export const insertListing =async (id:number,timeshareId:number,shares:number,owner:string,datelisted:number,chain:string) => {
    // Insert a row into the table

const listing = await querylisting(id,chain) 

if( listing.length <= 0)
{
const { meta: insert } = await db
.prepare(`INSERT INTO ${listingsTable} (id,timeshareId,shares,available,owner,datelisted,chain) VALUES ( ?,?,?,?,?,?,?);`)
.bind(id,timeshareId,shares,shares,owner,datelisted)
.run();
}else
{
    const { meta: insert } = await db
.prepare(`update ${listingsTable} set shares=?available=? where chain=? and id=?;`)
.bind(shares+listing[0].shares,shares+lising[0].available,chain,id)
.run(); 
}
// Wait for transaction finality
//await insert.txn?.wait();
}

export const insertOwnedTimeShare =async (id:string,timeshareId:number,shares:number,owner:string,chain:string) => {
    // Insert a row into the table

const owned = await queryOwnedTimeShares(timeshareId,chain,owner) 

if( owned.length <= 0)
{
const { meta: insert } = await db
.prepare(`INSERT INTO ${ownedtimesharesTable} (id,timeshareId,shares,owner,chain) VALUES ( ?,?,?,?,?);`)
.bind(id,timeshareId,shares,shares,owner)
.run();
}else
{
    const { meta: insert } = await db
.prepare(`update ${ownedtimesharesTable} set shares=? where chain=? and timeshareId=? and owner=?;`)
.bind(shares+owned[0].shares,chain,timeshareId,owner)
.run(); 
}
// Wait for transaction finality
//await insert.txn?.wait();
}

export const querylisting = async(id:number,chain:string)=>{
    try{
    const { results } = await db.prepare(`SELECT * FROM ${listingsTable} where id='${id} and chain='${chain}';`).all();

   return results;
}
catch(error:any)
{
    return []
}
}


export const queryOwnedTimeShares = async(timeShareId:number,chain:string,owner:string)=>{
    try{
    const { results } = await db.prepare(`SELECT * FROM ${ownedtimesharesTable} where timeShareId='${timeShareId} and chain='${chain}' and owner='${owner}'  ;`).all();

   return results;
}
catch(error:any)
{
    return []
}
}

export const queryProfile = async(id:string)=>{
    try{
    const { results } = await db.prepare(`SELECT * FROM ${profilesTable} where id='${id}';`).all();

   return results;
}
catch(error:any)
{
    return []
}
}