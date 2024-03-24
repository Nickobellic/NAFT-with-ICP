import styles from "../../public/UserReg.module.css";
import navStyles from "../../public/Navbar.module.css";
import React, {useState, useEffect} from "react";
import { Actor } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

let authClient = null;

async function init() {
  authClient = await AuthClient.create();
}

init();

const UserRegister = () => {
    const [nickName, setNickName] = useState(0); 
    const [principalID, setPrincipalID] = useState("");

    function handleSuccess() {
        const principalId = authClient.getIdentity().getPrincipal().toText();
      
        setPrincipalID(principalId);
      
        document.getElementById(
          "principalId"
        ).innerText = `Your PrincipalId: ${principalId}`;
      
        Actor.agentOf(naft_icp).replaceIdentity(
          authClient.getIdentity()
        );
      }

      function handleFailure(err) {
        console.log(err);
      }

      async function login() {
        const APP_NAME = "NFID example";
        const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
        const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;
      
        const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;
      
        console.log(BigInt(5));

        authClient.login({
          identityProvider,
          onSuccess: handleSuccess,
          onError: (e) => handleFailure(e),
          windowOpenerFeatures: `
            left=${window.screen.width / 2 - 525 / 2},
            top=${window.screen.height / 2 - 705 / 2},
            toolbar=0,location=0,menubar=0,width=525,height=705
          `,
        });
      }
    
    return (
        <div className={styles.newuser}>
            <h1 className={styles.user_title}>User Registration</h1>
            <div className={styles.user_input_div}>
                <h3 className={styles.user_input_explain}>Enter the nickname</h3>
                <input placeholder="Your nickname" className={styles.user_input} type="text" onChange={(e) => setNickName(e.target.value)}  required/>
            </div>
            <div className={styles.authButton}>
                <button className={navStyles.signupButton} onClick={login}>Authenticate</button>
            </div>
            <h3 className={styles.auth_detail_display}>
                Your Principal ID : { principalID.length == 0 ? <span style={{color: "red"}}> Unauthorized </span> : (principalID) }
                </h3>
        </div>
    );
}

export default UserRegister;