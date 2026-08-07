import React from "react";
import Document, { Head, Html, Main, NextScript, type DocumentContext, type DocumentInitialProps } from "next/document";

export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    return Document.getInitialProps(ctx);
  }

  render() {
    return React.createElement(
      Html,
      { lang: "vi" },
      React.createElement(Head, null),
      React.createElement(
        "body",
        null,
        React.createElement(Main, null),
        React.createElement(NextScript, null),
      ),
    );
  }
}
