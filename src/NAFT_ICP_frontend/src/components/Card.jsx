// components/Card.js
import React from 'react';
import styles from "../../public/newProduct.module.css";

const Card = ({ imgSrc, title, price, onBuy ,left }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardBanner}>
      <img src={imgSrc} alt={title} className={styles.cardImg} />

      </div>
      <div className={styles.cardBody}>
        <h4 className={styles.cardTitle}>{title}</h4>
        <div className={styles.row}>
        <h5>Current IPO</h5>
        <p className={styles.cardPrice}>{price} <span className='heroTitleSpan'>ICP</span></p>
        </div>
        <div className={styles.row}>
        <p>{left} Tokens left  </p>
        <button className={styles.buyButton} onClick={onBuy}>Buy</button>
        </div>
      </div>
    </div>
  );
}

export default Card;
