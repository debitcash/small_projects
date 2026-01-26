import { HomeTab } from "../src/components/HomeTab.jsx";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createBrowserRouter, createMemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Outlet, Link } from "react-router";


describe("Initial appearance of the HomeTab component", () =>{
    it("Shows loading, when awaiting for the gifurl", async () => {
        const router = createBrowserRouter([
            {
            path: '/',
            element: <Outlet context ={["", [], () => {return true}]}/>,
            children:[
                {index:true, element: <HomeTab/>},
            ]
            }
        ],
        { initialEntries: ["/"] }
        );
        
        render(<RouterProvider router={router} />);

        expect(screen.getByRole("heading", {name:"LOADING..."})).toBeInTheDocument();

    });

    it("Shows proper information on gif load", async () => {
        const router = createBrowserRouter([
            {
            path: '/',
            element: <Outlet context ={["www.saf.asf.com.tteesstt", [], () => {return true}]}/>,
            children:[
                {index:true, element: <HomeTab/>},
            ]
            }
        ],
        { initialEntries: ["/"] }
        );
        
        render(<RouterProvider router={router} />);
        
        expect(screen.getByRole("heading", {name:"Fashion is my profession"})).toBeInTheDocument();
        expect(screen.getByAltText("GIF")).toBeInTheDocument();
    });       
});

describe("Match the html layout", () =>{
    it("Matches the html, when awaiting for the gifurl", async () => {
        const router = createBrowserRouter([
            {
            path: '/',
            element: <Outlet context ={["", [], () => {return true}]}/>,
            children:[
                {index:true, element: <HomeTab/>},
            ]
            }
        ],
        { initialEntries: ["/"] }
        );
        
        const container = render(<RouterProvider router={router} />);

        expect(container).toMatchSnapshot();
    });
    
    it("Matches the html, when awaiting for the gifurl", async () => {
        const router = createBrowserRouter([
            {
            path: '/',
            element: <Outlet context ={["www.saf.asf.com.tteesstt", [], () => {return true}]}/>,
            children:[
                {index:true, element: <HomeTab/>},
            ]
            }
        ],
        { initialEntries: ["/"] }
        );

        const container = render(<RouterProvider router={router} />);

        expect(container).toMatchSnapshot();
    });
});