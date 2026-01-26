import { use, useEffect, useState } from 'react';
import styles from "./ProductCard.module.css";

function ProductCard({productInfo, products, setProducts, position}){
     let [ addedItemsAmount, setAddedItemsAmount ] = useState(0);

    function onIncrement(){
        setAddedItemsAmount(addedItemsAmount + 1);
    }
    
    function onDecrement(){
        if (addedItemsAmount == 0){
            return;
        }

        setAddedItemsAmount(addedItemsAmount - 1);
    }

    function addToCart(){
        let newProducts = [...products];

        newProducts[position] = {...products[position], isInCart:true, quantityOrdered:newProducts[position].quantityOrdered + addedItemsAmount};
        console.log(newProducts);
        setProducts(newProducts);
    }

    return <div className={styles.productCard}>
        <div className={styles.photoContainer}><img className={styles.cardPhoto} src={productInfo.imageUrl}/></div>
        <div className={styles.productCardHeader}>
            <span>{productInfo.title}</span>
            <span>${productInfo.price}</span>
        </div>
        <div style={{width:"100%", marginTop:"auto"}}>
            <div className={styles.quantityContainer}>
                <div>
                    <button className={styles.changeQuantityButton} onClick={() => {onDecrement()}}>-</button>
                    <input className={styles.quantityInput} type="text" value={addedItemsAmount} onChange={(e) => setAddedItemsAmount(parseInt(e.target.value))}/>
                    <button className={styles.changeQuantityButton} onClick={() => {onIncrement()}}>+</button>
                </div>
                <span>${productInfo.price * addedItemsAmount}</span>
            </div>
        </div>
            <button className={styles.addToCartButton} onClick={() => {addToCart()}}>Add to cart!</button>
    </div>;
}

export { ProductCard };