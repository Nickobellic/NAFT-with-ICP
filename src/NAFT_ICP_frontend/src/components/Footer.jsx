import React from 'react'; 
import style from "../../public/Footer.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div>
      <footer className={style.footer}>
        <div className={style.container}>
          <div className={style.row}>
            <div className={style.footerCol}>
              <div className={style.jump}>
                <img src="../../public/images/logo.png" alt="Logo" width="110" height="50" />
              </div>
              <p className={style.para}>NFT trading has revolutionized the digital ownership landscape, enabling creators and collectors to buy, sell, and exchange unique digital assets securely on the blockchain.</p>
              <p className={style.join}><strong>Join the community</strong></p>
              <div className={style.socialLinks}>
                <a href="#"><FontAwesomeIcon icon={faDiscord} /></a>
                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#"><FontAwesomeIcon icon={faYoutube} /></a>
              </div>
            </div>
            <div className={style.footerCol}>
              <h4>Marketplace</h4>
              <ul>
                <li><a href="#">⦿ Gaming</a></li>
                <li><a href="#">⦿ Product</a></li>
                <li><a href="#">⦿ All NFTs</a></li>
                <li><a href="#">⦿ Social Network</a></li>
                <li><a href="#">⦿ Domain Names</a></li>
                <li><a href="#">⦿ Collectibles</a></li>
              </ul>
            </div>
            <div className={style.footerCol}>
              <h4>Explore</h4>
              <ul>
                <li><a href="#">⦿ Featured Drops</a></li>
                <li><a href="#">⦿ Live Auctions</a></li>
                <li><a href="#">⦿ All NFTs</a></li>
                <li><a href="#">⦿ Collections</a></li>
                <li><a href="#">⦿ Top seller</a></li>
                <li><a href="#">⦿ Item Details</a></li>
              </ul>
            </div>
            <div className={style.footerCol}>
              <h4>Supports</h4>
              <ul>
                <li><a href="#">⦿ Settings & Privacy</a></li>
                <li><a href="#">⦿ Help & Support</a></li>
                <li><a href="#">⦿ Live Auctions</a></li>
                <li><a href="#">⦿ 24/7 Supports</a></li>
                <li><a href="#">⦿ Item Details</a></li>
                <li><a href="#">⦿ Blog</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      <div className={style.copyright}>
        <p className={style.copyrightLink}>© 2024 <a href="#">@Team bravo</a> all rights reserved</p>
      </div>
    </div>
  );
}

export default Footer;
