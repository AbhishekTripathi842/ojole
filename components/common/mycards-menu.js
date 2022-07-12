import Link from "next/link";
import React from "react";

const MyCardsMenu = ({ tab }) => {
  return (
    <div className="mycards-menu">
      <div className="menu-container">
        <ul>
          <li className={tab == 0 ? "active" : ""}>
            <Link
              href={{
                pathname: "/my-cards",
                query: { tab: 0 },
              }}
            >
              Sent &amp; Scheduled
            </Link>
          </li>
          <li className={tab == 1 ? "active" : ""}>
            <Link
              href={{
                pathname: "/my-cards",
                query: { tab: 1 },
              }}
            >
              Drafts
            </Link>
          </li>
          <li className={tab == 2 ? "active" : ""}>
            <Link
              href={{
                pathname: "/my-cards",
                query: { tab: 2 },
              }}
            >
              Received
            </Link>
          </li>
          <li className={tab == 3 ? "active" : ""}>
            <Link
              href={{
                pathname: "/my-cards",
                query: { tab: 3 },
              }}
            >
              Archived
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default MyCardsMenu;
