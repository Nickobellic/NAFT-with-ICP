import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import React, {useState, useEffect} from 'react';
import styles from '../../public/newProduct.module.css'; // Import CSS module for styling
import { locStore } from "../pages/UserReg";
import { useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";

// 100 110 120 130

const AuctionDetails = () => {
    const {auctID} = useParams();
    const [auctionDetail, setDetails] = useState({});

    async function getAuctionDetails() {
        const details = await naft_icp.getAuctionAssetData(Principal.fromText(auctID));
        setDetails(details);
        console.log(details);
    }

    useEffect(() => {
        getAuctionDetails();
    }, []);

    console.log(auctionDetail);
    return (
        <div className={styles.card}>
        <div className={styles.cardBanner}>
        <img src={auctionDetail.dataString || "/images/explore-product-1.jpg"} alt={title} className={styles.cardImg} />
  
        </div>
        <div className={styles.cardBody}>
          <h4 className={styles.cardTitle}>{auctionDetail.assetName}</h4>
          <div className={styles.nftIDBody}>
            <p className={styles.cardNFTLabel}>NFT ID</p>
            <h6 className={`${styles.cardTitle} ${styles.nftID}`}>{auctID}</h6>
          </div>
  
          <div className={styles.row}>
          <h5>Starting Bid</h5>
          <p className={styles.cardPrice}>{price} <span className='heroTitleSpan'>ICP</span></p>
          </div>
           { (authID != process.env.CANISTER_OWNER_PRINCIPAL && auth == "true") && <div className={`${styles.buttonRow}`}>
            <button disabled={auth == true ? true : false} className={`${styles.detailsButtonSize} ${styles.buyButton}`} onClick={seeDetails}>Bid</button>
          </div>}
          <div className={styles.nftIDBody}>
            <p className={styles.cardNFTLabel}>Conducted By</p>
            <h6 style={{color: "red"}} className={`${styles.cardTitle} ${styles.nftID}`}>{ownerID}<a hidden={!full} onClick={() => setFull(true)}>...</a></h6>
          </div>
          </div>
      </div>
    );

}


export default AuctionDetails;