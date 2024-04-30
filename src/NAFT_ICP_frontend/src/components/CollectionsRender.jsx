import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import new_styles from "../../public/UserReg.module.css";
import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import styles from '../../public/newProduct.module.css';
import { Grid } from '@mui/material';
import dotenv from 'dotenv';
import { locStore } from "../pages/UserReg";
import imageFor from "../utils/imageSelect";
import ColleCard from '../components/CollecCard';
import { Principal } from "@dfinity/principal";
import { Navigate, useNavigate } from "react-router-dom";



const CollectionRender = ({data, ownerList, idList, buyFunction, type}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  async function handleBuy(team, nftID, ownerID, action) {
    let authStatus = await locStore.get("authenticated");
    let browser = await locStore.get("walletID");
    if(authStatus === "true") {
      console.log("Transaction Started");
      console.log(process.env.CANISTER_OWNER_PRINCIPAL);
      if(action == "Buy") {
        let nftPrincipal = Principal.fromText(nftID);
        let fromAccount = Principal.fromText(process.env.CANISTER_OWNER_PRINCIPAL);
        let toAccount = Principal.fromText(browser);
        const transferStatus = await naft_icp.transferAsset(nftPrincipal, fromAccount, toAccount, type);
        console.log(transferStatus);
      } else if(action == "Sell") {
        let nftPrincipal = Principal.fromText(nftID);
        let fromAccount = Principal.fromText(browser);
        let toAccount = Principal.fromText(process.env.CANISTER_OWNER_PRINCIPAL);
        const transferStatus = await naft_icp.transferAsset(nftPrincipal, fromAccount, toAccount, type);
        console.log(transferStatus);
      }
      console.log("Transaction Ended");
      window.location.reload();

    } else {
      await handleAuth();
    }
  }
  

  async function handleAuth() {
    console.log("redirecting");
    navigate("/new-user");
  }

    return (<div>
        <h1 className={new_styles.user_title} style={{textAlign: "center", marginTop: "50px"}}>{type}s</h1>
    <Grid container spacing={8} style={{color: "white"}}>
    
    { data.map((nft, index) => (
      <Grid key={index} item xs={12} sm={6} md={4} lg={3} >
        <ColleCard
          imgSrc={type == "NFT" ? nft.dataString : imageFor[type]}
          nftID = {idList[index]}
          ownerID = {ownerList[index]}
          docType={type}
          audioSrc={type != "NFT" && nft.dataString}
          title={nft.assetName}
          description={nft.assetDesc}
          price={parseInt(nft.assetPrice)}
          onBuy={handleBuy}
          left={parseInt(nft.assetToken)}
        />
      </Grid>
    ))
    }

    </Grid>
    {data.length == 0 && 
        (<h2 style={{color: "white", marginTop: "75px", textAlign: "center"}}>No {type}s present in your Collections</h2>)}
    </div>)
    
}

export default CollectionRender;