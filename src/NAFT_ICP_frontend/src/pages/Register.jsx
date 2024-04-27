import {useContext, useCallback, createContext, useState, useEffect} from "react";
import React from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import { locStore } from "./UserReg";
import { Switch } from "@mui/material";
import {FormGroup, FormControlLabel} from "@mui/material";
import styles from "../../public/Navbar.module.css";
import authStyles from "../../public/UserReg.module.css";
import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import { Nat } from "@dfinity/candid/lib/cjs/idl";
import { Principal } from "@dfinity/principal";

const Register = () => {
    const [walletID, setWalletID] = useState("");
    const [title, setTitle] = useState();
    const [color, setColor] = useState('gold');
    const [auth, setAuth] = useState("false");
    const [forAuction, setForAuction] = useState(false);
    const [basePrice, setBasePrice] = useState(0);
    const [desc, setDesc] = useState();
    const [clicked, setClicked] = useState(false);
    const [price, setPrice] = useState(0);
    const [token, setToken] = useState(0);
    const [data, setData] = useState([]);
    const [fileData,setFileData] = useState('');
    const [fileName, setFileName] = useState('');


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



        nftDetails();
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
        console.log("Started");
        let mintedData = await naft_icp.mintNFT(title, desc, parseInt(price), parseInt(token), data, Principal.fromText(walletID), forAuction, parseInt(basePrice) );
        //console.log(Principal.toString(mintedData));
        console.log("Ended");
        await naft_icp.getYourNFTs(Principal.fromText(walletID));
        setClicked(false);

    }

    // Function to convert file into Data URL
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Encode the file using the FileReader API
        const reader = new FileReader();
        reader.onloadend = () => {
            setData(reader.result);
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
            <h1 style={{ color: 'white', display: "flex", justifyContent: "center", marginTop: "30px" }}>Create NFTs</h1>
            <div style={{marginTop: "30px"}}>
                <div>
                    <h3 className={authStyles.auth_detail_display}>
                        Your Wallet ID :  <span style={{color: color}}> {walletID} </span> 
                    </h3>
                </div>
                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Title</h2>
                    <div className={styles.actions}>
                    <input name="nftTitle" onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Description</h2>
                    <div className={styles.actions}>
                    <input name="nftDesc" onChange={(e) => setDesc(e.target.value)} type="text" placeholder="Description" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Token Price</h2>
                    <div className={styles.actions}>
                    <input name="nftPrice" onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Token Price (in XDC)" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Total Tokens</h2>
                    <div className={styles.actions}>
                    <input name="nftTokens" onChange={(e) => setToken(e.target.value)} type="number" placeholder="Total Tokens" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div style={{marginTop: "30px"}}>
                    <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Upload NFT data</h2>
                    <div className={styles.actions}>
                    <input onChange={handleFileChange} accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
 name="nftData"  type="file" placeholder="Search" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                    </div>
                </div>

                <div>
                <div style={{marginTop: "30px", marginLeft: "15%"}}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={forAuction} onChange={(e) => {setForAuction(e.target.checked)}} color="warning"/>} label="Auction the asset" sx={{color: "white"}} />
                    </FormGroup>
                </div>
                {forAuction && 
                        <div style={{marginTop: "30px"}}>
                            <h2 style={{color: "white", display: "flex", justifyContent: "flex-start", marginLeft: "15%"}}>Starting Bid Price</h2>
                            <div className={styles.actions}>
                                <input name="nftAuctionBasePrice" onChange={(e) => setBasePrice(e.target.value)} type="number" placeholder="Bid Price to start the Auction" className={styles.feild} style={{width: "70%", marginLeft: "15%"}} required/>
                            </div>
                        </div>}
                    <button disabled={clicked} className={styles.signupButton} style={{ marginTop: "50px", width: "10%", marginLeft: "45%", marginRight: "45%" }} onClick={handleMint}>Mint</button>
                </div>
            </div>
        </div>): (
            <h1 className={authStyles.user_title}><Link to="/new-user">Authenticate</Link> to access Minting</h1>
        )
    )
}


export default Register;