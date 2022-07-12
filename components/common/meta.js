import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { head } from "next/head";

export default function Meta(props) {
  return (
    <head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title></title>
    </head>
  );
}
