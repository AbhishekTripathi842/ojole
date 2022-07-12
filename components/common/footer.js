import Link from "next/link";

const FooterComponent = () => {
  return (
    <div className="footer-div">
      <div className="footer-row-div">
        <div className="footer-section-logo-div">
          <img src="/assets/image/ojolie-footer-logo.svg" />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed amet
            augue egestas nullam diam in amet, in.
          </p>
        </div>
        <div className="footer-section-page-div">
          <div>
            <label id="head-page-label">Ecards</label>
            <label>All Cards</label>
            <label>Free Cards</label>
            <label>New Cards</label>
          </div>
          <div>
            <label id="head-page-label">About</label>
            <label>Our story</label>
            <label>Press</label>
            <label>Membership</label>
          </div>
          <div>
            <label id="head-page-label">Help</label>
            <label>Contact</label>
            <label>FAQ</label>
            <Link href="/privacy-policy">
              <label>Privacy</label>
            </Link>
          </div>
        </div>
        <div className="footer-section-link-div">
          <div id="icon-block">
            <a href="https://www.facebook.com/OjolieCards" target="_blank">
              <img src="/images/facebook-icon.svg" />
            </a>
          </div>
          <div id="icon-block">
            <a href="https://www.pinterest.com/ojolie/" target="_blank">
              <img src="/images/pinterest-icon.svg" />
            </a>
          </div>
          <div id="icon-block">
            <a href="https://www.instagram.com/ojolie.ecards" target="_blank">
              <img src="/images/instagram-icon.svg" />
            </a>
          </div>
          {/* <div id="icon-block">
            <a href="">
              <img src="/images/youtube-icon.svg" />
            </a>
          </div> */}
        </div>
      </div>
      <div className="footer-copyright-div">
        <p>
          OJOLIE APS | NØRREVANG 73, 1. TH, 3460 BIRKERØD, DENMARK | CVR
          38723103 COPYRIGHT © 2020 OJOLIE, ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
};
export default FooterComponent;
