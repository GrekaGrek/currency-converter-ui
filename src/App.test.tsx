import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

test('renders navigation links and routes correctly', () => {
    render(
        <Router>
            <App/>
        </Router>
    );
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/public/i)).toBeInTheDocument();

    const adminLink = screen.getByText(/admin/i);
    userEvent.click(adminLink);

    expect(screen.getByText(/Manage Conversion Fees/i)).toBeInTheDocument();

    const publicLink = screen.getByText(/public/i);
    userEvent.click(publicLink);

    expect(screen.getByText(/Currency Converter/i)).toBeInTheDocument();
});
