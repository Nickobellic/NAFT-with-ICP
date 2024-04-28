// components/Card.js
import React, {useState, useEffect} from 'react';
import styles from '../../public/newProduct.module.css'; // Import CSS module for styling
import { locStore } from '../pages/UserReg';
import dotenv from 'dotenv';
import { Navigate, useNavigate } from 'react-router-dom';


const AuctionCard = ({ imgSrc, title,description, price, onBuy ,left, nftID, ownerID }) => {
  const [full, setFull] = useState(false);
  const [action, setAction] = useState();
  const [ownersID, setOwnerID] = useState(ownerID);
  const [auth, setAuth] = useState(false);
  const [authID, setAuthID] = useState("");
  const [seller,setSeller] = useState(false);

  const navigate = useNavigate();

  async function checkOwnership() {
    let authUser = await locStore.get("walletID");
    let authStatus = await locStore.get("authenticated");
    setAuth(authStatus);
    setAuthID(authUser);
    console.log(authUser, ownerID);
    if(authUser === ownerID) {
      setSeller(true);
      setAction("Sell");
    } else {
      setSeller(false);
      setAction("Buy");
    }
  }


  useEffect(() => {
      checkOwnership();      
  });


  function seeDetails() {
    navigate(`/auction/${nftID}`);
  }

  console.log(process.env.CANISTER_OWNER_PRINCIPAL);

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
        <h5>Starting Bid</h5>
        <p className={styles.cardPrice}>{price} <span className='heroTitleSpan'>ICP</span></p>
        </div>
         { (authID != process.env.CANISTER_OWNER_PRINCIPAL && auth == "true") && <div className={`${styles.buttonRow}`}>
          <button disabled={auth == true ? true : false} className={`${styles.detailsButtonSize} ${styles.buyButton}`} onClick={seeDetails}>See Details</button>
        </div>}
        <div className={styles.nftIDBody}>
          <p className={styles.cardNFTLabel}>Conducted By</p>
          <h6 style={{color: "red"}} className={`${styles.cardTitle} ${styles.nftID}`}>{ownerID}<a hidden={!full} onClick={() => setFull(true)}>...</a></h6>
        </div>
        </div>
    </div>
  );
}

export default AuctionCard;
