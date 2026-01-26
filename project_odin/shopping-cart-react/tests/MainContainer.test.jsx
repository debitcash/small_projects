import { MainContainer } from "../src/components/MainContainer.jsx";
import App  from "../src/App.jsx";
import { vi, describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createBrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

describe("Initial appearance of the App component", () =>{
    it("Renders correct navigation links", async () => {
        const router = createBrowserRouter([
            {
                path: '/',
                element: <MainContainer />,
            }
        ]);
        
        render(<RouterProvider router={router} />);

        expect(screen.getByRole("link", {name:"Home"})).toBeInTheDocument();
        expect(screen.getByRole("link", {name:"Shop"})).toBeInTheDocument();
        expect(screen.getByRole("link", {name:"Cart"})).toBeInTheDocument();
    });

    it("Calculates number of cart added items and displays them properly", async () => {
        // Mock fetch globally
        global.fetch = vi.fn()
        .mockResolvedValueOnce({ json: () => Promise.resolve({ title: "Product 1", data:{images: {original:{url:"test"}}}, price: 10, quantityOrdered: 0 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ title: "Product 1", image: "img1.jpg", price: 10, quantityOrdered: 0 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ title: "Product 2", image: "img2.jpg", price: 20, quantityOrdered: 0 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ title: "Product 3", image: "img3.jpg", price: 30, quantityOrdered: 0 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ title: "Product 4", image: "img4.jpg", price: 40, quantityOrdered: 1 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ title: "Product 5", image: "img5.jpg", price: 50, quantityOrdered: 3 }) })
        .mockResolvedValueOnce({ json: () => Promise.resolve({ title: "Product 6", image: "img6.jpg", price: 60, quantityOrdered: 2 }) });

        const router = createBrowserRouter([
            {
                path: '/',
                element: <MainContainer />,
            }
        ]);
        
        render(<RouterProvider router={router} />);

        const total = await screen.findByText("6"); 
        expect(total).toBeInTheDocument();
    }); 
});





