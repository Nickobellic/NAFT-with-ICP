// pages/index.js
import React from 'react';
import { Grid } from '@mui/material';
import Card from '../components/OldCard';
import expItem1 from "../../public/images/explore-product-1.jpg";
import expItem2 from "../../public/images/explore-product-2.jpg";
import expItem3 from "../../public/images/explore-product-3.jpg";
import expItem4 from "../../public/images/explore-product-4.jpg";
import expItem5 from "../../public/images/explore-product-5.jpg";
import expItem6 from "../../public/images/explore-product-6.jpg";
import expItem7 from "../../public/images/explore-product-7.jpg";
import expItem8 from "../../public/images/explore-product-8.jpg";
import styles from "../../public/newProduct.module.css";

const Product = () => {
  const handleBuy = () => {
    // Handle buy button click
    console.log('Buy button clicked');
  };

  return (
    <div style={{ backgroundColor: 'hsl(0, 0%, 7%)', width: '100%',padding: "120px 0" }}>
        <div className ="container">
        <div className='section-header-wrapper'>

      <h2>Explore Products</h2>
      <button className={styles.signupButton}>EXPLORE</button>

      </div>  
      <Grid container spacing={8} style={{color: "white"}}>
        <Grid item xs={12} sm={6} md={4} lg={3} >
          <Card
            imgSrc={expItem1}
            title="Product 1"
            price="250"
            onBuy={handleBuy}
            left="5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={expItem2}
            title="Product 2"
            price="120"
            onBuy={handleBuy}
            left="12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={expItem3}
            title="Product 3"
            price="300"
            onBuy={handleBuy}
            left="10"

          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={expItem4}
            title="Product 4"
            price="180"
            onBuy={handleBuy}
            left="2"

          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} >
          <Card
            imgSrc={expItem5}
            title="Product 5"
            price="450"
            onBuy={handleBuy}
            left="10"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={expItem6}
            title="Product 6"
            price="220"
            onBuy={handleBuy}
            left="8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={expItem7}
            title="Product 7"
            price="100"
            onBuy={handleBuy}
            left="20"

          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card
            imgSrc={expItem8}
            title="Product 8"
            price="50"
            onBuy={handleBuy}
            left="15"

          />
        </Grid>
      </Grid>
      </div>
    </div>
  );
}

export default Product;
