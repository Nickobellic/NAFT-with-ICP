// components/navbar.js

import styles from "../../public/Navbar.module.css";
import logo from "../../public/images/logo.png";
import "../../public/styles.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "../pages/HomePage";
import Register from "../pages/Register";
import UserRegister from "../pages/UserReg";
import { useContext, useEffect } from 'react';
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
//import { naft_icp } from "../../../declarations/naft_icp";
import {NAFT_ICP_backend as naft_icp} from "../../../declarations/NAFT_ICP_backend";
import React from "react";
import {Link} from "react-router-dom";
import Collections from "../pages/Collections";

let authClient = null;

async function init() {
  authClient = await AuthClient.create();

}

function handleSuccess() {
  const principalId = authClient.getIdentity().getPrincipal().toText();

  console.log(principalId);

  console.log(authClient.getIdentity());

  document.getElementById(
    "principalId"
  ).innerText = `Your PrincipalId: ${principalId}`;

  Actor.agentOf(naft_icp).replaceIdentity(
    authClient.getIdentity()
  );


}


init();



async function login() {
  const APP_NAME = "NFID example";
  const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
  const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

  const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;


  authClient.login({
    identityProvider,
    onSuccess: handleSuccess,
    windowOpenerFeatures: `
      left=${window.screen.width / 2 - 525 / 2},
      top=${window.screen.height / 2 - 705 / 2},
      toolbar=0,location=0,menubar=0,width=525,height=705
    `,
  });
}
 

const Navbar = () => {

  useEffect(() => {
    async function getName() {
  
      const maniacNFT = await naft_icp.greetNFT("Cryptodunks");
      const anotherManiacNFT = await naft_icp.greetNFT("Cryptodunks");

      const caller = await naft_icp.whoIsCalling();

      console.log(maniacNFT);
      console.log(anotherManiacNFT);
      console.log(caller);
    }
    getName();
  }, []); 


  return (
    <BrowserRouter>
    <div className="container">
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
        <img src={logo} alt="Logo" width="100%" height="auto" display="block"/>
        </Link>
      </div>
      <ul className={styles.menu}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/create-nft">Create</Link></li>
        <li><Link to="/my-nfts">Collections</Link></li>
        <li><Link to="#">About</Link></li>
        <li><Link to="/auctions">Auctions</Link></li>
        <li><Link to="/new-user">Wallet</Link></li>
      </ul>
      <div className={styles.actions}>

        <input type="text" placeholder="Search" className={styles.feild} />
            <button className={styles.signupButton} onClick={login}>Connect</button>
      </div>
    </nav>
    </div>
           <Routes>
           <Route exact path="/" element={<HomePage />} />
           <Route path="/my-nfts" element={<Collections />} />
           <Route path="/create-nft" element={<Register />} />
           <Route path="/new-user" element={<UserRegister />} />
           <Route path="/auctions" />
         </Routes>
    </BrowserRouter>
  );
};



export default Navbar;