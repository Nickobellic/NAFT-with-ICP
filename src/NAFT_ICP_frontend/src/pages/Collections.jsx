import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import styles from '../../public/newProduct.module.css';
import { locStore } from "./UserReg"; 
import { Grid } from '@mui/material';
import ColleCard from '../components/CollecCard';
import { Principal } from "@dfinity/principal";


const Collections = () => {

    const [nftData, setNFTData] = useState([]);
    const [nftOwners, setNFTOwners] = useState([]);
    const [imageList, setImageData] = useState([]);
    const [walletID, setWalletID] = useState('');

    console.log(imageList);

    // --------- ICP -------------

    async function getWalletID() {
        let locStoreID = await locStore.get("walletID");
        setWalletID(locStoreID);
    }

    async function getAllMintedNFTs() {
        let nfts = await naft_icp.getAllNFTs();
        let nftData = nfts.map((nft) => nft[1]);
        let nftOwners = nfts.map((nft) => nft[0].toText());
        setNFTData(nftData);
        setNFTOwners(nftOwners);

        console.log(nftOwners);
    }

    useEffect(() => {
        getWalletID();
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

    async function handleBuy(team) {
        console.log("Hey");
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
    
      console.log(imageList);
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
            imgSrc={nft.nftImageData}
            nftID = {nftOwners[index]}
            title={nft.nftName}
            description={nft.nftDesc}
            price={parseInt(nft.nftPrice)}
            onBuy={handleBuy}
            left={parseInt(nft.nftToken)}
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