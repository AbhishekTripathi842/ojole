import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/common/header";
import Meta from "../../components/common/meta";
import FooterComponent from "../../components/common/footer";

function TermsOfServicePage() {
  const [token, setToken] = useState("");

    return (
      <main>
        <Head>
          <title>T&C</title>
          <Meta />
        </Head>
        <Header tokenData={(data)=>setToken(data)} />
  
        <div className="terms-of-service-wrapper">
            
                <div className="top-section">
                <h1>Terms of Service</h1>
                </div>

                <div className="grey-container">
                    <p className="body">By accessing, browsing and/or using Ojolie.com ("Site"), you acknowledge that you have read, 
                    understood, agree and accept to be bound to these terms of service ("Terms") and to comply with all applicable 
                    laws and regulations.</p>
                </div>
                <div className="blue-container">
                    <p className="head">Your Use of this Site</p>
                    <p className="body">Ojolie.com ("The Company") hereby grants you a limited license to use the materials, features, 
                    and services provided by the Company on this Site ("Materials") solely for your personal, non-commercial use, subject to these Terms. 
                    All Materials are protected by international copyright, and owned or controlled by the Company or the parties credited in the copyright 
                    notices within the Materials. You may not modify, publish, transmit, participate in the transfer or sale of, reproduce, 
                    create new works from, distribute, perform, display, or in any way exploit, any of the Materials in whole or in part, 
                    except as otherwise provided for in this Agreement. You agree that any copy of the Materials that you make or have in 
                    your possession shall be unaltered and shall retain all copyright and other proprietary notices contained therein. 
                    Posting of any Materials from this Site on any other website, distributing any of the Materials from this Site, or 
                    otherwise causing the Site to be displayed in a frame of another website is not allowed without prior written consent 
                    from the Company.</p>
                </div>
                <div className="grey-container">
                    <p className="head">License for Members</p>
                    <p className="body">The Company hereby grants you a limited license to use such ecards and other features of the Site as 
                    are from time to time determined, at the Company's sole discretion, to be available for Members only.
                    <br /><br />
                    You will be required to provide a valid e-mail address during the membership enrollment process and it is your responsibility 
                    to notify the Company of any e-mail address updates through the functions on this Site. You will also be required to 
                    select a password and under no circumstances are you allowed to disclose this password or allow others to use it to access this Site.
                    <br /><br />
                    You are solely responsible for your actions and communications undertaken or transmitted using this Site. Neither we, nor our affiliates, 
                    exercise editorial control over your transmissions; however, we do reserve the right to review transmissions in order to ensure compliance with these Terms.
                    <br /><br />
                    The Company does not represent or endorse the accuracy or reliability of any opinion, statement, or other information displayed or 
                    distributed through the Site by any person or entity. You acknowledge that any reliance upon any such opinion, statement or 
                    other information shall be at your sole risk.
                    <br /><br />
                    The ecards on this Site are the sole work of one artist, Frederikke Tu, and the Site is therefore reliant on the continued 
                    ability of the artist to create these ecards. This license does therefore not commit the Company to the release of further ecards,
                    maintenance and/or availability of the Site.
                    <br /><br />
                    All Materials are subject to change without notice. The Company may from time to time in its sole discretion modify the list of ecards 
                    and other features of the Site which are available exclusively to Members. The Company may also change, suspend or close the Site, 
                    or any part or feature of the Site, or restrict access to parts or the whole of the Site, without notice or liability.</p>
                </div>
                <div className="blue-container">
                    <p className="head">Enforcement</p>
                    <p className="body">In the event the Company determines, in its sole discretion, that you have violated these Terms, 
                    The Company shall have the right to immediately terminate your account without refund, refuse membership, and/or block 
                    the sending or receipt of greetings from our Site, and/or pursue any other legal remedies.</p>
                </div>
                <div className="grey-container">
                    <p className="head">License Cancellation</p>
                    <p className="body">You may cancel your license at any time. Unless terminated beforehand, your licence will end 
                    on a date determined by the Company according to the amount of the fee paid by you in accordance with the price 
                    list published on the Site. Should your license be cancelled or terminated, or the Site closed for any reason 
                    whatsoever, refunds will be given solely at the discretion of the Company.</p>
                </div>
                <div className="blue-container">
                    <p className="head">Updates to Terms</p>
                    <p className="body">The Company shall have the right to revise these Terms at any time by updating this posting. 
                    By using this Site, you agree to be bound by any such revisions and should therefore periodically visit this Site 
                    to determine the current Terms to which you are bound.</p>
                </div>
                <div className="grey-container">
                    <p className="head">Spam</p>
                    <p className="body">You may not use this Site to send online greeting cards to mailing lists to which you do not have 
                    full rights to utilize nor to send unsolicited bulk or commercial messages. In addition, the use of automated 
                    scripting-type programs that automate the process of sending or viewing any of the Materials is strictly prohibited. 
                    We reserve the right to limit, in our sole discretion and without prior notice to you, the number of cards or messages 
                    that you may send using the Site and/or the number of recipients to which you send such cards or messages.</p>
                </div>
                <div className="blue-container" style={{marginBottom:"160px"}}>
                    <p className="head">Indemnification</p>
                    <p className="body">You hereby indemnify, defend and hold harmless the Company and its affiliates, and all officers, 
                    employees, directors, owners, agents, content providers, licensors and licensees (collectively, the "Indemnified 
                    Parties") from and against any and all liability and costs, including, without limitation, attorneys' fees, 
                    incurred by the Indemnified Parties in connection with any claim arising out of any breach by you or any user of your 
                    account of this Agreement. You shall cooperate as fully as reasonably required in defense of any such claim. 
                    The Company reserves the right, at its own expense, to assume the exclusive defense and control of any matter 
                    subject to indemnification by you.
                    <br /><br />
                    The Materials provided on this Site are provided without warranty of any kind, either expressed or implied. 
                    The Company is not liable for damages of any kind arising from your access or inability to access or use the 
                    Site and is not responsible for failure of ecards sent through our service to reach their intended recipients 
                    or to reach the recipients on the date specified by you.</p>
                </div>
               
        </div>
        <FooterComponent />
      </main>
    );
  }
  
  export default TermsOfServicePage;