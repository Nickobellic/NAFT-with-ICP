// components/Card.js
import React, {useState, useEffect} from 'react';
import styles from '../../public/newProduct.module.css'; // Import CSS module for styling
import { locStore } from '../pages/UserReg';
import dotenv from 'dotenv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faDownload } from '@fortawesome/free-solid-svg-icons';

const ColleCard = ({ type ,imgSrc, docType, audioSrc, title,description, price, onBuy ,left, nftID, ownerID }) => {
  const [full, setFull] = useState(false);
  const [action, setAction] = useState();
  const [ownersID, setOwnerID] = useState(ownerID);
  const [auth, setAuth] = useState(false);
  const [authID, setAuthID] = useState("");
  const [play, setPlay] = useState(false);
  const [seller,setSeller] = useState(false);

  async function checkOwnership() {
    let authUser = await locStore.get("walletID");
    let authStatus = await locStore.get("authenticated");
    setAuth(authStatus);
    setAuthID(authUser);
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

  function playSound() {
    var sound = new Audio(audioSrc);
    play ? sound.pause() : sound.play();
    sound.onpause = () => setPlay(false);
    sound.onplay = () => setPlay(true);
  }

  function downloadImage() {
    console.log(imgSrc);
    if(docType != "NFT") {
    //window.open(audioSrc);
    const link = document.createElement("a");
    link.href = audioSrc;
    link.download = title;
    link.click();
    } else {
      //window.open(imgSrc);
      const link = document.createElement("a");
      link.href = imgSrc;
      link.download = title;
      link.click();
    }
}

  // console.log(process.env.CANISTER_OWNER_PRINCIPAL);

  return (
    <div className={styles.card}>
      <div className={styles.cardBanner}>
      <img src={imgSrc || "/images/explore-product-1.jpg"} alt={title} className={styles.cardImg} />

      </div>
      <div className={styles.cardBody}>
        <div style={{display: "flex", flexDirection: "row", marginLeft: "30%"}}>
        { docType == "Audio" && <button className={` ${styles.playButton}`} onClick={playSound} > <FontAwesomeIcon size='xl' icon={play ? faPause : faPlay} /></button> }
       {<button className={` ${styles.playButton}`} onClick={downloadImage}> <FontAwesomeIcon icon={faDownload} /> </button>}
        </div>

        
        <h4 className={styles.cardTitle}>{title}</h4>
        <div className={styles.nftIDBody}>
          <p className={styles.cardNFTLabel} style={{
            color: "white"
          }}>NFT ID</p>
          <h6 className={`${styles.cardTitle} ${styles.nftID}`}>{nftID}</h6>
        </div>

        <div className={styles.row}>
        <h5>Token Price</h5>
        <p className={styles.cardPrice}>{price} <span className='heroTitleSpan'>ICP</span></p>
        </div>
        <div className={styles.row}>
        <p>{left} Tokens Offered </p>
        </div>
         { (authID != process.env.CANISTER_OWNER_PRINCIPAL && auth == "true") && <div className={`${styles.buttonRow}`}>
          <button disabled={auth == true ? true : false} className={`${styles.buttonSize} ${styles.buyButton}`} onClick={(e) => onBuy(e, nftID, authID, action)}>{action}</button>
        </div>}
        <div className={styles.nftIDBody}>
          <p className={styles.cardNFTLabel}>Owned By</p>
          <h6 style={{color: "red"}} className={`${styles.cardTitle} ${styles.nftID}`}>{ownerID}<a hidden={!full} onClick={() => setFull(true)}>...</a></h6>
        </div>
        </div>
    </div>
  );
}

export default ColleCard;
