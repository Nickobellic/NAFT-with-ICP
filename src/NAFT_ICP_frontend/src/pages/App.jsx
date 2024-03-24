import React from "react";
import Navbar from "../components/NavBar";
import HomePage from "./HomePage";
import GoogleFontLoader from 'react-google-font-loader';


function App() {
    return(
        <>
            <GoogleFontLoader
      fonts={[
        {
          font: 'Inter',
          weights: [400, '400i'],
        },
        {
          font: 'Roboto Mono',
          weights: [100, 500, 700, 900],
        },
      ]}
      subsets={['latin']}
    />
            <div style={{fontFamily: 'Inter'}}>
                <Navbar />
            </div>
        </>
        
    );
}

export default App;