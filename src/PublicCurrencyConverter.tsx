import React, {useState} from 'react';
import axios from 'axios';


const PublicCurrencyConverter: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [fromCurrency, setFromCurrency] = useState<string>('');
    const [toCurrency, setToCurrency] = useState<string>('');
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const errorHandler = (error: any): string => {
        const response = error.response;
        if (response?.data?.errors) {
            return Object.entries(response.data.errors)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        }
        return response?.data?.message || 'Unknown error';
    };

    const convertCurrency = () => {
        const conversionData = { amount, fromCurrency, toCurrency };
        axios
            .post('/public/conversion/convert', conversionData)
            .then(response => {
                setResult(response.data)
                setError(null)
            })
            .catch(error => {
                setError(`Error converting currency: ${errorHandler(error)}`);
                setResult(null);
            });
    };

    const refreshRates = () => {
        axios
            .post('/public/conversion/refresh-rates')
            .then(() => {
                alert('Exchange rates refreshed!');
                setError(null);
            })
            .catch(error => setError(`Error refreshing exchange rates: ${errorHandler(error)}`));
    };

    return (
        <div>
            <h2>Currency Conversion</h2>
            <div>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="From Currency"
                    value={fromCurrency}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                    onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                />
                <input
                    type="text"
                    placeholder="To Currency"
                    value={toCurrency}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                    onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                />
                <button onClick={convertCurrency}>Convert</button>
            </div>
            {result !== null && <div>Result: {result}</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button onClick={refreshRates}
                    style={{marginTop: '10px', marginBottom: '10px'}}>
                Refresh Exchange Rates
            </button>
        </div>
    );
};

export default PublicCurrencyConverter;
