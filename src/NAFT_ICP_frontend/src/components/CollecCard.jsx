// components/Card.js
import React from 'react';
import styles from '../../public/newProduct.module.css'; // Import CSS module for styling

const ColleCard = ({ imgSrc, title,description, price, onBuy ,left, nftID }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardBanner}>
      <img src={imgSrc || "/images/explore-product-1.jpg"} alt={title} className={styles.cardImg} />

      </div>
      <div className={styles.cardBody}>
        <h4 className={styles.cardTitle}>{title}</h4>
        <div className={styles.nftIDBody}>
          <p className={styles.cardNFTLabel}>NFT ID</p>
          <h6 className={`${styles.cardTitle} ${styles.nftID}`}>{nftID}</h6>
        </div>

        <div className={styles.row}>
        <h5>Token Price</h5>
        <p className={styles.cardPrice}>{price} <span className='heroTitleSpan'>ICP</span></p>
        </div>
        <div className={styles.row}>
        <p>{left} Tokens Offered </p>
        </div>
        <div className={`${styles.buttonRow}`}>
          <button className={`${styles.buttonSize} ${styles.buyButton}`} onClick={onBuy}>Sell</button>
        </div>
        </div>
    </div>
  );
}

export default ColleCard;
