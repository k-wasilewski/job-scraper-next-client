import Head from "next/head";
import React from "react";

export const HeadComponent = () => (
    <Head>
        <title>{'Job Scraper'}</title>
        <meta name="description" content="Job Scraper application for performing periodical web scrapes of various lists-containing webpages." />
        <link rel="icon" href="/favicon.ico" />
    </Head>
);