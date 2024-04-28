// Fetch NFT IDs that are owned by the CANISTER_OWNER_PRINCIPAL

// Buying - Transfer NFT from OWNER_PRINCIPAL to requested Principal
// Selling - Vice Versa

import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import styles from '../../public/newProduct.module.css';
import { locStore } from "./UserReg"; 
import { Grid } from '@mui/material';
import dotenv from 'dotenv';
import ColleCard from '../components/CollecCard';
import { Principal } from "@dfinity/principal";
import { Navigate, useNavigate } from "react-router-dom";

const Collections = () => {
    const navigate = useNavigate();
    const [nftData, setNFTData] = useState([]);
    const [nftIDs, setNFTIDs] = useState([]);
    const [owners, setOwners] = useState([]);
    const [authenticated, setAuthenticated] = useState();
    const [imageList, setImageData] = useState([]);
    const [walletID, setWalletID] = useState('');

    //console.log(imageList);

    // --------- ICP -------------

    async function getWalletID() {
        let locStoreID = await locStore.get("walletID");
        let isAuthenticated = await locStore.get("authenticated");
        //console.log(isAuthenticated);
        setAuthenticated(isAuthenticated);
        setWalletID(locStoreID);
    }

    async function getAllMintedNFTs() {
        await getWalletID();
        let ownerList = [];
        let nftMetaData = [];
        let nfts = await naft_icp.getAllNFTs();
        //let nftData = nfts.map((nft) => nft[1]);
        //let ownerIDs = nfts.map((nft) => nft[0].toText());
        let nftList = [];

        nfts.forEach((nft) => {
          nft[1].map((nft) => nftList.push(nft.toText()));
        });
        //setNFTData(nftData);
        /*for(let nftID=0; nftID<ownerIDs.length; nftID++) {
          let ownerWithNFTs = {};
          ownerWithNFTs[ownerIDs[nftID]] = nftList[nftID];
          allNFTs.push(ownerWithNFTs);
        }*/
        setNFTIDs(nftList);


        for(const nft of nftList) {
          let owner = await naft_icp.getOwner(Principal.fromText(nft));
          let singleNFTData = await naft_icp.getAssetData(Principal.fromText(nft));
          ownerList.push(owner);
          nftMetaData.push(singleNFTData);
        }
        setOwners(ownerList);
        setNFTData(nftMetaData);
    }



    useEffect(() => {
        getAllMintedNFTs();
    }, []);



    // ----------- MONGO DB -----------
    async function execApi() {
        try {
            const response = await axios.get(`http://localhost:3001/api/yourNFTs`, {params: {
                address: account
            }} );

            setNFTData(response.data);


        } catch(error) {
            console.log("Unable to fetch your NFTs " , error);
        }
    }

    async function handleBuy(team, nftID, ownerID, action) {
      let authStatus = await locStore.get("authenticated");
      if(authStatus === "true") {
        console.log("Transaction Started");
        console.log(process.env.CANISTER_OWNER_PRINCIPAL);
        if(action == "Buy") {
          let nftPrincipal = Principal.fromText(nftID);
          let fromAccount = Principal.fromText(process.env.CANISTER_OWNER_PRINCIPAL);
          let toAccount = Principal.fromText(ownerID);
          const transferStatus = await naft_icp.transferNFT(nftPrincipal, fromAccount, toAccount);
          console.log(transferStatus);
        } else if(action == "Sell") {
          let nftPrincipal = Principal.fromText(nftID);
          let fromAccount = Principal.fromText(ownerID);
          let toAccount = Principal.fromText(process.env.CANISTER_OWNER_PRINCIPAL);
          const transferStatus = await naft_icp.transferNFT(nftPrincipal, fromAccount, toAccount);
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

    const convertArrayBufferToImage = (arrayBuffer) => {
        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;
      };

    /*useEffect(() => {
        execApi();
        let imageData = [];
        nftData.forEach((nft) => {

            const resp = convertArrayBufferToImage(nft.nftData);
            imageData.push(resp);
        })

        console.log(imageData);
        setImageData(imageData);
      }, []);*/
    
      // ------------------------------------


    return (
        <div style={{ backgroundColor: 'hsl(0, 0%, 7%)', width: '100%',padding: "120px 0" }}>
        <div class ="container">
        <div className='section-header-wrapper'>

      <h1 style={{color: "white"}}>Your Collections</h1>

      </div>  
      <Grid container spacing={8} style={{color: "white"}}>
      
      { nftData.map((nft, index) => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={3} >
          <ColleCard
            imgSrc={nft.dataString}
            nftID = {nftIDs[index]}
            ownerID = {owners[index]}
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
      {nftData.length == 0 && 
        (<h2 style={{color: "hsl(47, 100%, 49%)"}}>No NFTs present in your Collections</h2>)}
      </div>
    </div>

    )

}

export default Collections;