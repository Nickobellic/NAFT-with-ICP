import {useContext, useCallback, createContext, useState, useEffect} from "react";
import React from "react";
import axios from "axios";
import { locStore } from "./UserReg";
import styles from "../../public/Navbar.module.css";
import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import { Nat } from "@dfinity/candid/lib/cjs/idl";

const Register = () => {
    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [clicked, setClicked] = useState(false);
    const [price, setPrice] = useState(0);
    const [token, setToken] = useState(0);
    const [data, setData] = useState([]);
    const [fileData,setFileData] = useState('');
    const [fileName, setFileName] = useState('');


    // Get NFT Details
    useEffect(() => {

        async function nftDetails() {
            console.log(await locStore.get("authenticated"), await locStore.get("walletID"));
            let allNFTs = await naft_icp.getAllNFTs();
            console.log(allNFTs);
            if(allNFTs.length > 0) {
            setFileName(allNFTs[0].nftName);
            setFileData(allNFTs[0].nftImageData);
            }
            
        }

        nftDetails();
    }, []);

    // ICP Mint NFT Button
    const handleMint = async() => {
        /*let uintImage = data.toString('binary');
        console.log(uintImage);*/
        setClicked(true);
        console.log("Started");
        let mintedData = await naft_icp.mintNFT(title, desc, parseInt(price), parseInt(token), data );
        console.log("Ended");

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

        <div>
            <h1 style={{ color: 'white', display: "flex", justifyContent: "center", marginTop: "30px" }}>Create NFTs</h1>
            <div style={{marginTop: "30px"}}>
                <div>
                    <h2 style={{color: "white", display: "flex", justifyContent: "center"}}>Your Wallet Address : <span style={{color:"hsl(47, 100%, 49%)", marginLeft: "20px", marginBottom: "20px"}}>                    
</span>   </h2>
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
                    <button disabled={clicked} className={styles.signupButton} style={{ marginTop: "50px", width: "10%", marginLeft: "45%", marginRight: "45%" }} onClick={() => downloadImage(fileData, fileName)}>Mint</button>
                </div>
            </div>
        </div>
    )
}


export default Register;