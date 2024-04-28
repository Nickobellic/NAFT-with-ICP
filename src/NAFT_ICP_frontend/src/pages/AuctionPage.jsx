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
import AuctionCard from "../components/AuctionCard";
import { Principal } from "@dfinity/principal";
import AuctionRender from "../components/AuctionRender";
import { Navigate, useNavigate } from "react-router-dom";

const AuctionPage = () => {
    const navigate = useNavigate();
    const [nftData, setNFTData] = useState([]);
    const [nftIDs, setNFTIDs] = useState([]);
    const [authenticated, setAuthenticated] = useState();
    const [imageList, setImageData] = useState([]);
    const [walletID, setWalletID] = useState('');

    console.log(imageList);

    // --------- ICP -------------

    async function getWalletID() {
        let locStoreID = await locStore.get("walletID");
        let isAuthenticated = await locStore.get("authenticated");
        //console.log(isAuthenticated);
        setAuthenticated(isAuthenticated);
        setWalletID(locStoreID);
    }

    const [data, setData] = useState({
      nftData: [],
      audioData: [],
      videoData: [],
      textData: []
    });
    const [IDs, setIDs] = useState({
      nftIDs:[],
      audioIDs:[],
      videoIDs:[],
      textIDs:[]
    });
    const [owners, setOwners] = useState({
      nftOwners: [],
      audioOwners: [],
      videoOwners: [],
      textOwners:[],
    });
    //const [nftIDs, setNFTIDs] = useState([]);
    //const [owners, setOwners] = useState([]);


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
        let nfts = await naft_icp.getAllAuctionNFTs();
        console.log(nfts);
        //let nftData = nfts.map((nft) => nft[1]);
        //let ownerIDs = nfts.map((nft) => nft[0].toText());
        let nftList = [];
        // Getting NFT ID from it
        nfts.forEach((nft) => {
          nftList.push(nft.toText());
        });

        //setIDs({...IDs, nftIDs: nftList});

        // Getting owners of the NFT LIst
        for(const nft of nftList) {
          let owner = await naft_icp.getAuctionConductorinNFT(Principal.fromText(nft));
          let singleNFTData = await naft_icp.getAuctionAssetData(Principal.fromText(nft));
          ownerList.push(owner);
          nftMetaData.push(singleNFTData);
        }
        //setOwners({...owners, nftOwners: ownerList});
        //setData({...data, nftData:nftMetaData});

        console.log(nftMetaData);
        // Text Section


      let textOwnerList = [];
      let textMetaData = [];
      let texts = await naft_icp.getAllAuctionTexts();
      //let nftData = nfts.map((nft) => nft[1]);
      //let ownerIDs = nfts.map((nft) => nft[0].toText());
      let textList = [];
      // Getting NFT ID from it
      texts.forEach((text) => {
        textList.push(text.toText());
      });

      // Getting owners of the NFT LIst
      for(const text of textList) {
        let owner = await naft_icp.getAllAuctionTexts(Principal.fromText(text));
        let singleTextData = await naft_icp.getAuctionAssetData(Principal.fromText(text));
        textOwnerList.push(owner);
        textMetaData.push(singleTextData);
      }

      let audioOwnerList = [];
      let audioMetaData = [];
      let audios = await naft_icp.getAllAuctionAudios();
      //let nftData = nfts.map((nft) => nft[1]);
      //let ownerIDs = nfts.map((nft) => nft[0].toText());
      let audioList = [];
      // Getting NFT ID from it
      audios.forEach((audio) => {
        audioList.push(audio.toText());
      });
      setIDs({...IDs, textIDs: textList, nftIDs: nftList, audioIDs: audioList});

      // Getting owners of the NFT LIst
      for(const audio of audioList) {
        let owner = await naft_icp.getAllAuctionAudios(Principal.fromText(audio));
        let singleAudioData = await naft_icp.getAuctionAssetData(Principal.fromText(audio));
        audioOwnerList.push(owner);
        audioMetaData.push(singleAudioData);
      }
      

      setOwners({...owners, textOwners: textOwnerList, nftOwners: ownerList, audioOwners: audioList});
      setData({...data, textData:textMetaData ,  nftData: nftMetaData, audioData: audioMetaData});
    }

    useEffect(() => {
        getAllMintedNFTs();
    }, []);

    console.log(data, owners, IDs);

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

      <h1 style={{color: "white"}}>View all Auctions</h1>

      </div>  
      
      <AuctionRender type={"NFT"} data={data.nftData} ownerList={owners.nftOwners} idList={IDs.nftIDs} buyFunction={handleBuy}/>  
      <AuctionRender type={"Audio"} data={data.audioData} ownerList={owners.audioOwners} idList={IDs.audioIDs} buyFunction={handleBuy}/>
      <AuctionRender type={"Text"} data={data.textData} ownerList={owners.textOwners} idList={IDs.textIDs} buyFunction={handleBuy}/>
      <AuctionRender type={"Video"} data={data.videoData} ownerList={owners.videoOwners} idList={IDs.videoIDs} buyFunction={handleBuy}/>

      </div>
    </div>

    )

}

export default AuctionPage;