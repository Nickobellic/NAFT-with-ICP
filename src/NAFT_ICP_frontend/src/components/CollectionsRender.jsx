import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import new_styles from "../../public/UserReg.module.css";
import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import styles from '../../public/newProduct.module.css';
import { Grid } from '@mui/material';
import dotenv from 'dotenv';
import imageFor from "../utils/imageSelect";
import ColleCard from '../components/CollecCard';
import { Principal } from "@dfinity/principal";
import { Navigate, useNavigate } from "react-router-dom";


const CollectionRender = ({data, ownerList, idList, buyFunction, type}) => {
    return (<div>
        <h1 className={new_styles.user_title} style={{textAlign: "center", marginTop: "50px"}}>{type}s</h1>
    <Grid container spacing={8} style={{color: "white"}}>
    
    { data.map((nft, index) => (
      <Grid key={index} item xs={12} sm={6} md={4} lg={3} >
        <ColleCard
          imgSrc={type == "NFT" ? nft.dataString : imageFor[type]}
          nftID = {idList[index]}
          ownerID = {ownerList[index]}
          title={nft.assetName}
          description={nft.assetDesc}
          price={parseInt(nft.assetPrice)}
          onBuy={buyFunction}
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