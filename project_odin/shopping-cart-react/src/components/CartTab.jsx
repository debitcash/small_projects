import { useOutletContext } from "react-router";
import styles from "./CartTab.module.css";

function CartTab(){
    let [ gifUrl, products, setProducts ] = useOutletContext();

    function changeAmount(amount, index){
        if (products[index].quantityOrdered + amount < 0) return;
        
        if (products[index].quantityOrdered + amount == 0){
            onRemovePressed(index);
            return;
        }
        
        let newProducts = [...products];
        newProducts[index] = {...products[index], quantityOrdered:newProducts[index].quantityOrdered + amount};
        setProducts(newProducts);
    }

    function onRemovePressed(index){
        let newProducts = [...products];

        newProducts[index] = {...products[index], quantityOrdered:0, isInCart:false};
        setProducts(newProducts);
    }

    return <>
        <h1>Cart</h1>
        <div className={styles.cartContainer}>
        {products.filter((product) => product.isInCart).map((product) => 
            <div className={styles.productInCart}>
                <span>{product.title}</span>

                <div>
                    <span>{product.quantityOrdered}</span>
                    <span> X {product.price}</span>
                    <span> Subtotal: ${product.quantityOrdered * product.price}</span>
                </div>

                <div>
                    <button onClick={() => changeAmount(-1, product.index)}>-</button>
                    <button onClick={() => changeAmount(1, product.index)}>+</button>
                    <button onClick={() => {onRemovePressed(product.index)}}>REMOVE</button>
                </div>
            </div>)}

        <h4>Total items: {products.reduce((accumulator, product)=> {
             return product.isInCart ? accumulator + product.quantityOrdered : accumulator;
        }, 0)} 
        <br/>
        
            Total charge: ${products.reduce((accumulator, product)=> {
             return product.isInCart ? accumulator + product.quantityOrdered * product.price : accumulator;
        }, 0)} 
        
        </h4>
    
        </div>
    </>;
}

export { CartTab };