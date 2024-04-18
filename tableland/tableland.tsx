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

export const updateProfile =async (id:string,name:string,photo:string,description:string,country:string,state:string,city:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`Update ${profilesTable}  set name=?,photo=?,description=?,country=?,state=?,city=? where id=?;`)
.bind(name,photo,description,country,state,city,id)
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
    const { results } = await db.prepare(`SELECT ${ownedtimesharesTable}.id,${ownedtimesharesTable}.shares,${ownedtimesharesTable}.chain,${timesharesTable}.name,${timesharesTable}.price,${timesharesTable}.shares as totalshares,${timesharesTable}.photo as image,${profilesTable}.name as owner,${profilesTable}.photo, FROM ${ownedtimesharesTable} join ${timesharesTable} on ${ownedtimesharesTable}.timeshareId = ${timesharesTable}.id and ${timesharesTable} on ${ownedtimesharesTable}.chain = ${timesharesTable}.chain join ${profilesTable} on ${timesharesTable}.owner = ${profilesTable}.id where ${ownedtimesharesTable}.timeShareId='${timeShareId}' and ${ownedtimesharesTable}.chain='${chain}' and ${ownedtimesharesTable}.owner='${owner}'  ;`).all();

   return results;
}
catch(error:any)
{
    return []
}
}


export const queryMyTimeShares = async(timeShareId:number,chain:string,owner:string)=>{
    try{
    const { results } = await db.prepare(`SELECT ${timesharesTable}.*,${profilesTable}.name,${profilesTable}.photo as ownerphoto FROM ${timesharesTable} join ${profilesTable} on ${profilesTable}.id = ${timesharesTable}.owner where timeShareId='${timeShareId} and chain='${chain}' and owner='${owner}'  ;`).all();

   return results;
}
catch(error:any)
{
    return []
}
}


export const queryPurchasedTimeShares = async(timeShareId:number,chain:string,owner:string)=>{
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



export const alterTable = async() =>{
    const { meta: insert } = await db
    .prepare(`Alter table ${listingsTable} ADD COLUMN chain text;`)
    .run();
     await db
    .prepare(`Alter table ${listingsTable} ADD COLUMN country text;`)
    .run();
    await db
    .prepare(`Alter table ${listingsTable} ADD COLUMN state text;`)
    .run();
    await db
    .prepare(`Alter table ${listingsTable} ADD COLUMN city text;`)
    .run();

    await db
    .prepare(`Alter table ${ownedtimesharesTable} ADD COLUMN chain text;`)
    .run();


    }