import { use, useEffect, useState } from 'react';
import { useOutletContext } from "react-router";
import styles from "./HomeTab.module.css";

function HomeTab(){
    let [ gifUrl, products, setProducts ] = useOutletContext();
    
    return <>
        {gifUrl !== "" ? <>
            <h1>Home</h1>
            <h2>Fashion is my profession</h2>
            <p>Get a chance to buy hand-picked essentials for YOU by Me!</p>
            <div className={styles.imageContainer}><img src={gifUrl} alt="GIF"/></div>
            </>
            :
            <h2>LOADING...</h2>
      }
    </>;
}

export {HomeTab};