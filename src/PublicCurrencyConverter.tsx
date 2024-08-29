import React, { useState } from 'react';
import axios from 'axios';

const PublicCurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [fromCurrency, setFromCurrency] = useState<string>('');
    const [toCurrency, setToCurrency] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);

    const convertCurrency = async () => {
        const response = await axios.get('/public/conversion/convert', {
            params: {
                amount,
                fromCurrency,
                toCurrency,
            },
        });
        setResult(response.data);
    };

    const refreshRates = async () => {
        await axios.post('/public/conversion/refresh-rates');
        alert('Exchange rates refreshed!');
    };

    return (
        <div>
            <h2>Currency Conversion</h2>
            <div>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    style={{ marginRight: '10px', marginBottom: '10px' }}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="From Currency"
                    value={fromCurrency}
                    style={{ marginRight: '10px', marginBottom: '10px' }}
                    onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                />
                <input
                    type="text"
                    placeholder="To Currency"
                    value={toCurrency}
                    style={{ marginRight: '10px', marginBottom: '10px' }}
                    onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                />
                <button onClick={convertCurrency}>Convert</button>
            </div>
            {result !== null && <div>Result: {result}</div>}
            <button onClick={refreshRates} style={{ marginTop: '10px', marginBottom: '10px' }}>Refresh Exchange Rates</button>
        </div>
    );
};

export default PublicCurrencyConverter;
