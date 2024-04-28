import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import React, {useState, useEffect} from 'react';
import styles from '../../public/newProduct.module.css'; // Import CSS module for styling
import { locStore } from "../pages/UserReg";
import { useParams } from "react-router-dom";
import { Principal } from "@dfinity/principal";

// 100 110 120 130

const AuctionDetails = () => {
    const {auctID} = useParams();
    const [auth, setAuth] = useState("false");
    const [authID, setAuthID] = useState("");
    const [ownerID, setOwnerID] = useState("");
    const [auctionDetail, setDetails] = useState({});

    async function getAuctionDetails() {
        await getAuthResult();
        const details = await naft_icp.getAuctionAssetData(Principal.fromText(auctID));
        setDetails(details);
        console.log(details);
    }

    async function getAuthResult() {
      const authID = await locStore.get("walletID");
      setAuthID(authID);
      const authStatus = await locStore.get("authenticated"); 
      setAuth(authStatus);
    }

    useEffect(() => {
        getAuctionDetails();
    }, []);

    console.log(auctionDetail);
    return (
        <div className={`${styles.card} ${styles.auctionDetails}`}>
        <div className={styles.auctionCardBanner}>
        <img src={auctionDetail.dataString || "/images/explore-product-1.jpg"} alt={auctionDetail.assetName} className={styles.auctioncardImg} />
  
        </div>
        <div className={styles.cardBody}>
          <h4 className={styles.cardTitle}>{auctionDetail.assetName}</h4>
          <div className={styles.nftIDBody}>
            <p className={styles.cardNFTLabel}>NFT ID</p>
            <h6 className={`${styles.cardTitle} ${styles.nftID}`}>{auctID}</h6>
          </div>
  
          <div className={styles.auctionRow}>
          <h5 style={{color: "white", margin: "20px"}}>Starting Bid</h5>
          <p className={styles.cardPrice}>{parseInt(auctionDetail.assetPrice)} <span className='heroTitleSpan'>ICP</span></p>
          </div>

          <div className={styles.auctionRow}>
          <h5 style={{color: "white",margin: "20px", marginLeft: "70px"}}>{auctionDetail.assetType} Tags</h5>
          <p className={styles.cardPrice}>{auctionDetail.assetTags}</p>
          </div>

          <div className={styles.auctionRow}>
          <h5 style={{color: "white",margin: "20px", marginLeft: "70px"}}>{auctionDetail.assetType} Description</h5>
          <p className={styles.cardPrice}>{auctionDetail.assetDesc}</p>
          </div>

           { (authID != process.env.CANISTER_OWNER_PRINCIPAL && auth == "true") && <div className={`${styles.buttonRow}`}>
            <button disabled={auth == "true" ? true : false} className={`${styles.detailsButtonSize} ${styles.buyButton}`} onClick={console.log("Hi")}>Bid</button>
          </div>}
          <div className={styles.nftIDBody}>
            <p className={styles.cardNFTLabel}>Conducted By</p>
            <h6 style={{color: "red"}} className={`${styles.cardTitle} ${styles.nftID}`}>{ownerID}</h6>
          </div>
          </div>
      </div>
    );

}


export default AuctionDetails;