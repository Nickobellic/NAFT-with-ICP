import React, {useState, useContext} from 'react';
import Footer from "../components/Footer"
import { Grid } from '@mui/material';
import NewProduct from './RAProducts';
import Product from './Product';
import AboutUs from './AboutUs';
import hero from "../../public/images/hero.png";
import "../../public/styles.css";

const HomePage = () => {

  return (
    <div>
      <div className="line"></div>
    <div className="container"style={{height:"38vw"}}
>
    <Grid container spacing={2} style={{ padding: '100px 0' }}>
      <Grid item xs={8}lg={6} className="hero">

              <h1 style={{ color: 'white' }}>Invest In Digital Assets</h1>
              <h1 style={{ color: 'white' }}>Buy/Sell your <span className="heroTitleSpan">NFT</span></h1>
              <h1 style={{ color: 'white' }}>Ownership</h1>
              <p style={{ color: 'white' }}>Discover, Invest, Collect :</p>
              <p style={{ color: 'white' }}>Your Journey into Digital Ownership Begins With Us</p>
 : 
      
      <button className="btnsec">Explore Now</button>
      </Grid>
      <Grid item xs={8}lg={6}>  
      <img 
  src={hero} 
  alt="Image 1"  
  className="image-container"
/>

      </Grid>
    </Grid>
    
    </div>
    <NewProduct/>
    <AboutUs/>
    <Product/>
      <Footer/>
    </div>
  );
};

export default HomePage;
