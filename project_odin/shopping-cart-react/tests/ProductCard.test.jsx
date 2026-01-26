import { ProductCard } from "../src/components/ProductCard.jsx";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createBrowserRouter, createMemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Outlet, Link } from "react-router";


describe("Populates with right type of information and HTML elements", () =>{
    it("Contains all required starting elements", async () => {
        render(<ProductCard position={0} productInfo={{title:"THE PRODUCT", price:23, imageUrl:"url.com"}} 
            products={{}} setProducts={() => {return false}} />);

        expect(screen.getByText("THE PRODUCT")).toBeInTheDocument();
        expect(screen.getByText("-")).toBeInTheDocument();
        expect(screen.getByText("+")).toBeInTheDocument();
        expect(screen.getByText("Add to cart!")).toBeInTheDocument();
        expect(screen.getByRole("img")).toBeInTheDocument();
        expect(screen.getByText("$0")).toBeInTheDocument();
    });

    it("Reacts properly to the button presses", async () => {
        const user = userEvent.setup();

        render(<ProductCard position={0} productInfo={{title:"THE PRODUCT", price:23, imageUrl:"url.com"}} 
            products={{}} setProducts={() => {return false}} />);


        const decrementButton = screen.getByText("-");
        const incrementButton = screen.getByText("+");

        await user.click(incrementButton);
        await user.click(incrementButton);
        await user.click(incrementButton);

        await user.click(decrementButton);
        
        expect(screen.getByText("$46")).toBeInTheDocument();
        expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    });

    it("Add to cart press works", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<ProductCard position={0} productInfo={{title:"THE PRODUCT", price:23, imageUrl:"url.com"}} 
            products={[{}]} setProducts={onClick} />);


        const addToCartButton = screen.getByText("Add to cart!");

        await user.click(addToCartButton);
        await user.click(addToCartButton);
        await user.click(addToCartButton);
        expect(onClick).toHaveBeenCalledTimes(3);
        
    });
});