import { useOutletContext } from "react-router";
import { ProductCard } from './ProductCard';
import styles from "./ShopTab.module.css";

function ShopTab(){
    let [ gifUrl, products, setProducts ] = useOutletContext();

    return <>
        <h1>Shop</h1>
        
        <div className={styles.cardsContainer}>
            {
                products.map((productInfo, index) => <ProductCard position={index} productInfo={productInfo} products={products} setProducts={setProducts} />)
            }
        </div>
    </>;
}

export { ShopTab };