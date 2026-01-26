import { ShopTab } from "../src/components/ShopTab.jsx";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createBrowserRouter, createMemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Outlet, Link } from "react-router";


describe("Populates with right type of information and HTML elements", () =>{
    it("Contains Header", async () => {
        const router = createBrowserRouter([
            {
            path: '/',
            element: <Outlet context ={["", [], () => {return true}]}/>,
            children:[
                {index:true, element: <ShopTab/>},
            ]
            }
        ],
        { initialEntries: ["/"] }
        );
        
        render(<RouterProvider router={router} />);

        expect(screen.getByRole("heading", {name:"Shop"})).toBeInTheDocument();
    });
});