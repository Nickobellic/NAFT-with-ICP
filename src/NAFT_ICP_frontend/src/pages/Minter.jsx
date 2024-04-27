import React, {useState, useEffect} from 'react';
import styles from "../../public/UserReg.module.css";
import navStyles from "../../public/Navbar.module.css";
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';


const Minter = () => {
    const [docType, setDocType] = useState('NFT');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDocType(e.target.value);
    }

    const handleRoute = () => {
        navigate(`/mint/${docType}`)
    }

    console.log(docType);

    return (
        <div style={{display:"flex", height:"85vh" , justifyContent: "center"}}>
            <div className={styles.user_input_div} style={{marginTop: "30px", flexDirection: "column", alignSelf: "center"}}>
            <h1 className={styles.user_title} style={{textAlign: "center"}}>Mint Assets</h1>

            <FormControl sx={{width: "250px"}}>
                <InputLabel id="demo-simple-select-label">Document Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"

                        value={docType}
                        label="Age"
                        onChange={handleChange}
                        sx={{
                            fontSize: 20,
                            display: "flex",
                            background: "hsl(0, 0%, 15%)",
                            color: "hsl(0, 0%, 70%)",
                        }}
                    >
                        <MenuItem value={'NFT'}>NFT</MenuItem>
                        <MenuItem value={'Text'}>Text Documents</MenuItem>
                        <MenuItem value={'Video'}>Video</MenuItem>
                        <MenuItem value={'Audio'}>Audio</MenuItem>
                    </Select>
            </FormControl>
            <div className={styles.authButton}>
                <button className={navStyles.signupButton} onClick={handleRoute}>Proceed</button>
            </div>
            </div>
        </div>
    )
}

export default Minter;