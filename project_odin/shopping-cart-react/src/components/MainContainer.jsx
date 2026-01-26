import { Outlet, Link } from "react-router";
import { useState, useEffect } from 'react';
import styles from "./MainContainer.module.css";

function MainContainer(){
    let [ gifUrl, setGifUrl ] = useState(""); 
    let [ products, setProducts ] = useState([]);

    useEffect(() => {
        fetch("https://api.giphy.com/v1/gifs/random?api_key=DgAZ8Thyezh23ogI7geVWFr0a5CfMfJQ&tag=fashion")
        .then((response) => response.json())
        .then((responseJson) => {setGifUrl(responseJson.data.images.original.url);})
    }, []);

    useEffect(() => {
        let ids = [];

        while (ids.length < 6){
            let randomId = getRandomId();

            if (!ids.includes(randomId)){
                ids.push(randomId);
            }
        }

        let promises= [];

        ids.forEach((id, index) => {
            promises.push(
                fetch(`https://fakestoreapi.com/products/${id}`)
                    .then(response => response.json())
                    .then(data => {
                        return {title:data.title, imageUrl:data.image, price:data.price, quantityOrdered:data.quantityOrdered || 0, isInCart:false, index:index};
                    })
                );
        });

        Promise.all(promises).then(productObjects => {/*console.log(productObjects); */setProducts(productObjects)});
    }, []);

    return <>
     <div className={styles.mainContainer}>
      <nav className={styles.navigation}>
          <Link to="/">Home</Link>
          <Link to="shop">Shop</Link>
          <Link to="cart">Cart</Link>

          <div className={styles.totalCartAmount}><span>{products.reduce((accumulator, product) => accumulator + product.quantityOrdered, 0)}</span></div>
      </nav>
      
        <Outlet context={[gifUrl, products, setProducts]} />
      </div>
      
      </>;
}

export { MainContainer };

function getRandomId(){
    return Math.floor(Math.random() * 20) + 1;
}