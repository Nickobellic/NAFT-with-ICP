import {useContext, useCallback, createContext, useState} from "react";
import React from "react";
import axios from "axios";
import styles from "../../public/Navbar.module.css";
import { NAFT_ICP_backend as naft_icp } from "../../../declarations/NAFT_ICP_backend";
import { Nat } from "@dfinity/candid/lib/cjs/idl";

const Register = () => {
    const [title, setTitle] = useState();
    const [desc, setDesc] = useState();
    const [price, setPrice] = useState(0);
    const [token, setToken] = useState(0);
    const [data, setData] = useState([]);

    const handleMint = async() => {
        console.log(data);
        let uintImage = new Uint8Array(data);
        let mintedData = await naft_icp.mintNFT(title, desc, parseInt(price), parseInt(token), Array.from(uintImage));

        let allNFTs = await naft_icp.getAllNFTs();
        console.log(allNFTs);

    }


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          console.log(arrayBuffer);
          setData(arrayBuffer);
        };
        reader.readAsArrayBuffer(file);
      };

    console.log(data);

    async function mintNFT(tit, des, pri, tok, data) {
        console.log("Clicked");
        console.log(data);
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
                    <button className={styles.signupButton} style={{ marginTop: "50px", width: "10%", marginLeft: "45%", marginRight: "45%" }} onClick={handleMint}>Mint</button>
                </div>
            </div>
        </div>
    )
}


export default Register;