import { CartTab } from "../src/components/CartTab.jsx";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createBrowserRouter, createMemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Outlet, Link } from "react-router";

describe("Populates with right type of information and HTML elements", () =>{
    it("Contains All the starting elements", async () => {
        const router = createBrowserRouter([
            {
            path: '/',
            element: <Outlet context ={["", [{title:"THE PRODUCT", price:23, imageUrl:"url.com", quantityOrdered:6, isInCart:true}], () => {return true}]}/>,
            children:[
                {index:true, element: <CartTab/>},
            ]
            }
        ],
        { initialEntries: ["/"] }
        );
        
        render(<RouterProvider router={router} />);

        expect(screen.getByRole("heading", {name:"Cart"})).toBeInTheDocument();
        expect(screen.getByText("THE PRODUCT")).toBeInTheDocument();
        expect(screen.getByText("-")).toBeInTheDocument();
        expect(screen.getByText("+")).toBeInTheDocument();
        expect(screen.getByText("REMOVE")).toBeInTheDocument();
        expect(screen.getByText("X 23")).toBeInTheDocument();
        expect(screen.getByText("6")).toBeInTheDocument();
        expect(screen.getByText("Subtotal: $138")).toBeInTheDocument();
    });

    it("Reacts properly to the button presses", async () => {
        const user = userEvent.setup();
        const setProducts = vi.fn();

        let products = [{title:"THE PRODUCT", price:23, imageUrl:"url.com", index:0, quantityOrdered:2, isInCart:true}];

        const router = createBrowserRouter([
            {
            path: '/',
            element: <Outlet context ={["", products, setProducts]}/>,
            children:[
                {index:true, element: <CartTab/>},
            ]
            }
        ],
        { initialEntries: ["/"] }
        );
        
        render(<RouterProvider router={router} />);

        const decrementButton = screen.getByText("-");
        const incrementButton = screen.getByText("+");

        await user.click(incrementButton);
        expect(setProducts).toHaveBeenCalledWith([{...products[0], quantityOrdered:3}]);

        await user.click(decrementButton);
        expect(setProducts).toHaveBeenCalledWith([{...products[0], quantityOrdered:1}]);

        const removeButton = screen.getByText("REMOVE");
        await user.click(removeButton);
        expect(setProducts).toHaveBeenCalledWith([{...products[0], quantityOrdered:0, isInCart:false}]);
    });
});