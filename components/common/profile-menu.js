import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Router from "next/router";

const ProfileMenu = ({ tab, name }) => {
  return (
    <div className="profile-menu">
      <div className="menu-container">
        <h1>{name}</h1>
        <ul>
          <li className={tab == "my-cards" ? "active" : ""}>
            <Link href="/my-cards">My cards</Link>
          </li>
          <li className={tab == "address-book" ? "active" : ""}>
            <Link href="/address-book">Address Book</Link>
          </li>
          <li className={tab == "account" ? "active" : ""}>
            <Link href="/account">Account</Link>
          </li>
          <li className={tab == "billing" ? "active" : ""}>
            <Link href="/billing">Billing</Link>
          </li>
          <li className={tab == "help-faq" ? "active" : ""}>
            <Link href="/help-FAQs">Help/FAQ</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default ProfileMenu;
