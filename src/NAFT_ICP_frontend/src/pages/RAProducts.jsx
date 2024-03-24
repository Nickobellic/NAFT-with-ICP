// pages/index.js
import React, {useState, useEffect, useContext,} from 'react';
import { Grid } from '@mui/material';
import Card from '../components/Card';
import itemOne from "../../public/images/new-item-1.jpg";
import itemTwo from "../../public/images/new-item-2.jpg";
import itemThree from "../../public/images/new-item-3.jpg";
import itemFour from "../../public/images/new-item-4.jpg";
import axios from "axios";
import "../../public/styles.css";
import styles from "../../public/newProduct.module.css";


// Get all NFTs that are bought with an API

const NewProduct = () => {
  const handleBuy = () => {
    // Handle buy button click
    console.log('Buy button clicked');
  };


  /*const fetchMyNFT = async(account) => {
    try {
      const response = await axios.get("http://localhost:3001/api/yourNFTs", {params: {
        address: account
      }});
    } catch(error) {
      console.log("Unable to fetch your NFTs ", error);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchMyNFT(account);
    })
  }, [account]); */  
  return (

    <div style={{ backgroundColor: 'hsl(0, 0%, 7%)', width: '100%',padding: "120px 0" }}>
        <div className ="container">
        <div className='section-header-wrapper'>

      <h2 >Newest Items</h2>
      <button className={styles.signupButton}>VIEW ALL</button>

      </div>  
      <Grid container spacing={8} style={{color: "white"}}>
        <Grid item xs={12} sm={6} md={4} lg={3} >
          <Card
            imgSrc={itemOne}
            title="Product 1"
            price="210"
            onBuy={handleBuy}
            left="9"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={itemTwo}
            title="Product 2"
            price="60"
            onBuy={handleBuy}
            left="25"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={itemThree}
            title="Product 3"
            price="400"
            onBuy={handleBuy}
            left="13"

          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={itemFour}
            title="Product 4"
            price="100"
            onBuy={handleBuy}
            left="4"

          />
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

export default NewProduct;
