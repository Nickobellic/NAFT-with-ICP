import styles from "../../public/UserReg.module.css";
import navStyles from "../../public/Navbar.module.css";
import React, {useState, useEffect} from "react";
import { Actor } from "@dfinity/agent";
import { AuthClient, LocalStorage } from "@dfinity/auth-client";
import { redirect } from "react-router-dom";

let authClient = null;
let locStore;

async function init() {
  locStore = new LocalStorage();

  authClient = await AuthClient.create(
    {storage: locStore,
      keyType: 'Ed25519',
 }
  );

}

init();

const UserRegister = () => {

    useEffect(() => {
      async function getLS() {
        await locStore.set("walletID", authClient.getIdentity().getPrincipal().toText() );
        await locStore.set("authenticated", await authClient.isAuthenticated() );
        let authSuccess = await authClient.isAuthenticated();
        if(authSuccess) {
          setPrincipalID(authClient.getIdentity().getPrincipal().toText());
        }
        // console.log(await locStore.get("auth")); // Principal ID from localStorage
      }

      getLS();
    }, [])


    const [nickName, setNickName] = useState(0); 
    const [principalID, setPrincipalID] = useState("");

    function handleSuccess() {
        window.location.reload();
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
          maxTimeToLive: BigInt(5 * 60 * 1000 * 1000 * 1000), // 5 minutes
          windowOpenerFeatures: `
            left=${window.screen.width / 2 - 525 / 2},
            top=${window.screen.height / 2 - 705 / 2},
            toolbar=0,location=0,menubar=0,width=525,height=705
          `,
        });

      }

      async function logout() {
        await authClient.logout();
        window.location.reload();
      }
    
    return (
        <div className={styles.newuser}>
            <h1 className={styles.user_title}>User Registration</h1>
            <div className={styles.user_input_div}>
                <h3 className={styles.user_input_explain}>Enter the nickname</h3>
                <input placeholder="Your nickname" className={styles.user_input} type="text" onChange={(e) => setNickName(e.target.value)}  required/>
            </div>
            <div>
            <div className={styles.authButton}>
                <button className={navStyles.signupButton} onClick={login}>Authenticate</button>
            </div>
            <div className={styles.authButton}>
                <button className={navStyles.signupButton} onClick={logout}>Log Out</button>
            </div>
            </div>
            <h3 className={styles.auth_detail_display}>
                Your Principal ID : { principalID.length == 0 ? <span style={{color: "red"}}> Unauthorized </span> : (principalID) }
                </h3>
        </div>
    );
}



export default UserRegister;
export { locStore};
