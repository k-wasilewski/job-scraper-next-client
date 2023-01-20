import Head from "next/head";
import React from "react";
import Script from "next/script";

export const HeadComponent = () => (
    <>
        <Head>
            <title>{'Job Scraper'}</title>
            <meta name="description" content="Job Scraper application for performing periodical web scrapes of various lists-containing webpages." />
            <link rel="icon" href="/favicon.ico" />
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
                crossOrigin="anonymous" 
            />
        </Head>
        <Script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW"
            crossOrigin="anonymous"
        />
    </>
);