import {useContext, useCallback, createContext, useState, useEffect} from "react";
import acceptExtensions from "../../utils/switcher";
import React from "react";
import axios from "axios";
import {Link, Navigate, useNavigate, useParams} from "react-router-dom";
import { locStore } from "../UserReg";
import { Switch } from "@mui/material";
import {FormGroup, FormControlLabel} from "@mui/material";
import styles from "../../../public/Navbar.module.css";
import authStyles from "../../../public/UserReg.module.css";
import { NAFT_ICP_backend as naft_icp } from "../../../../declarations/NAFT_ICP_backend";
import { Nat } from "@dfinity/candid/lib/cjs/idl";
import { Principal } from "@dfinity/principal";

const MintAssets = () => {
    const navigate = useNavigate();
    const {mint_type} = useParams();
    const [walletID, setWalletID] = useState("");
    const [color, setColor] = useState('gold');
    const [auth, setAuth] = useState("false");
    const [clicked, setClicked] = useState(false);
    const [registerData,setRegisterData] = useState({
        token: 1,
        data: [],
        price: 1,
        desc: '',
        tags: '',
        title:'',
        auctionStatus:false
    });

    const [auctionData, setAuctionData] = useState({
        startingBidPrice: 1,
        auctionDuration: 1,
    });


    // Get NFT Details
    useEffect(() => {

        async function authStatus() {
            let authenticated = await locStore.get("authenticated");
            setAuth(authenticated);
            console.log(auth);

            let walletID = await locStore.get("walletID");
            let displayID = auth === "false" ? walletID : "Unauthenticated";
            //let color = auth==false ? "red" : "gold"; 
            setWalletID(displayID);
            setColor("gold");

        }

        async function nftDetails() {
            await authStatus();
            console.log(await locStore.get("authenticated"), await locStore.get("walletID"));
            let allNFTs = await naft_icp.getAllNFTs();
            let nftData = allNFTs.map((nft) => nft[1]);
            console.log(nftData);
            if(allNFTs.length > 0) {
            setFileName(allNFTs[0].nftName);
            setFileData(allNFTs[0].nftImageData);
            }
            
        }

        authStatus();

        //nftDetails();
    }, []);

    // Function to get ID of NFTs owned by you
    async function getYourNFTs() {
        console.log(walletID);
        if(walletID.length != 0 ) {
        let nftsByYou = await naft_icp.getYourNFTs(Principal.fromText(walletID));
        let nftIDs = nftsByYou.forEach((nft) => Principal.toString(nft));
        console.log("Minted By You: ", nftIDs);
        }
    }

    // ICP Mint NFT Button
    const handleMint = async() => {
        /*let uintImage = data.toString('binary');
        console.log(uintImage);*/
        setClicked(true);
        console.log(registerData.title, registerData.price, registerData.desc);
        console.log("Started");
        let mintedData = await naft_icp.mintAsset(mint_type,registerData.tags,registerData.title, registerData.desc, parseInt(registerData.price), parseInt(registerData.token), registerData.data, Principal.fromText(walletID), registerData.auctionStatus, parseInt(auctionData.startingBidPrice), parseInt(auctionData.auctionDuration) );
        //console.log(Principal.toString(mintedData));
        console.log("Ended");
        //await naft_icp.getYourNFTs(Principal.fromText(walletID));
        setClicked(false);
        navigate("/")

    }

    console.log(walletID);

    // Function to convert file into Data URL
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Encode the file using the FileReader API
        const reader = new FileReader();
        reader.onloadend = () => {
            setRegisterData({...registerData, data: reader.result});
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
        };
        reader.readAsDataURL(file);
      };
      
    
      
      // MongoDB NFT mint
    async function mintNFT(tit, des, pri, tok, data) {
        console.log("Clicked");
        try {


            const nftImageByte = [...new Uint8Array(data)];
            const response = await axios.post("http://localhost:3001/api/mintNFT", {
                title: tit,
                description: des,
                price: pri,
                tokens: tok,
                nftData: nftImageByte,
            });
            
            window.location.href = "/";
        } catch(error) {
            console.log("Failed to send NFT data: " + error);
        }
    }

    // Function for downloading the File
    function downloadImage(data, fileName) {
        window.open(data);
        const link = document.createElement("a");
        link.href = data;
        link.download = fileName;
        link.click();
    }
    
    
    /*function ellipseAddress(
        address,
        width) {
        return `${address?.slice(0, width + 2)}...${address?.slice(-width)}`;
      }
    

    
      const handleConnectWallet = useCallback(() => { // Callback to handle Wallet Connection
        console.log("called");
        connect();

      }, [connect]);
    
      const handleDisconnectWallet = useCallback(() => {  // Callback to handle Wallet Disconnection
        disconnect();
        window.location.reload();
      }, [disconnect]);*/

    return (
        auth === "true"?
        (<div>
            <h1 style={{ color: 'white', display: "flex", justifyContent: "center", marginTop: "30px" }}>Create Digitized {mint_type} Documents</h1>
            <div style={{marginTop: "30px"}}>
                <div>
                    <h3 className={authStyles.auth_detail_display}>
                        Your Wallet ID :  <span style={{color: color}}> {walletID} </span> 
                    </h3>
                </div>
                <div style={{marginTop: "40px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>{mint_type} Title</h2>
                    <div className={styles.actions}>
                    <input name="nftTitle" onChange={(e) => {setRegisterData({...registerData, title: e.target.value});}} type="text" placeholder="Title" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>{mint_type} Description</h2>
                    <div className={styles.actions}>
                    <input name="nftDesc" onChange={(e) => setRegisterData({...registerData, desc: e.target.value})} type="text" placeholder="Description" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>{mint_type} Token Price</h2>
                    <div className={styles.actions}>
                    <input min="1" name="nftPrice" onChange={(e) => setRegisterData({...registerData,price: e.target.value})} type="number" placeholder="Token Price (in XDC)" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Total {mint_type} Tokens</h2>
                    <div className={styles.actions}>
                    <input min="1" name="nftTokens" onChange={(e) => setRegisterData({...registerData,token: e.target.value})} type="number" placeholder={`Total ${mint_type} Tokens`} className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Tags</h2>
                    <div className={styles.actions}>
                    <input name="nftTitle" onChange={(e) => setRegisterData({...registerData, tags: e.target.value})} type="text" placeholder={`Tags related to ${mint_type}`} className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Upload {mint_type} Document</h2>
                    <div className={styles.actions}>
                        <button className={styles.signupButton} style={{ marginTop: "50px", height: "50px", width: "15%", marginLeft: "45%", marginRight: "45%" }}>
                        <input onChange={handleFileChange} accept={acceptExtensions[mint_type]}
 name="nftData"  type="file" placeholder="Search" className={styles.feild} style={{opacity: "0",width: "100%", height: "100%", marginLeft: "5%"}} required/>
                        <span style={{position: "relative", bottom: "20px"}}> { registerData.data.length==0 ? "Upload" : "Uploaded"}</span>
                        </button>
                    </div>
                </div>

                <div>
                <div style={{marginTop: "30px", marginLeft: "15%"}}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={registerData.auctionStatus} onChange={(e) => {setRegisterData({...registerData,auctionStatus: e.target.checked})}} color="warning"/>} label="Auction the asset" sx={{color: "white"}} />
                    </FormGroup>
                </div>
                {registerData.auctionStatus && 
                        <div>
                        <div style={{marginTop: "30px"}}>
                            <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Starting Bid Price</h2>
                            <div className={styles.actions}>
                                <input min="1" name="nftAuctionBasePrice" onChange={(e) => setAuctionData({...auctionData, startingBidPrice: e.target.value})} type="number" placeholder="Bid Price to start the Auction" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                            </div>
                        </div>
                        <div style={{marginTop: "30px"}}>
                            <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Total Auction Duration (in Hours)</h2>
                            <div className={styles.actions}>
                                <input min="1" name="nftAuctionHours" onChange={(e) => setAuctionData({...auctionData, auctionDuration: e.target.value})} type="number" placeholder="Auction Duration (in Hours)" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                            </div>
                        </div>
                        </div>
                        }
                    <button disabled={clicked} className={styles.signupButton} style={{ marginTop: "50px", width: "10%", marginLeft: "45%", marginRight: "45%" }} onClick={handleMint}>Mint</button>
                </div>
            </div>
        </div>): (
            <h1 className={authStyles.user_title}><Link to="/new-user">Authenticate</Link> to access Minting</h1>
        )
    )
}


export default MintAssets;