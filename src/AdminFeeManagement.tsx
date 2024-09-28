import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface Fee {
    id: number;
    fromCurrency: string;
    toCurrency: string;
    fee: number;
}

const feeService = {
    fetchFees: () => axios.get<Fee[]>('/admin/fees'),
    addFee: (fee: Partial<Fee>) => axios.post('/admin/fees', fee),
    updateFee: (id: number, fee: Partial<Fee>) => axios.put(`/admin/fees/${id}`, fee),
    deleteFee: (id: number) => axios.delete(`/admin/fees/${id}`),
};

const AdminFeeManagement: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [currentFee, setCurrentFee] = useState<Partial<Fee>>({
        fromCurrency: '',
        toCurrency: '',
        fee: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFees();
    }, []);

    const loadFees = () => {
        feeService.fetchFees()
            .then(response => setFees(response.data))
            .catch(error => setError(`Error fetching fees: ${handleAxiosError(error)}`));
    }

    const resetForm = () => {
        setCurrentFee({fromCurrency: '', toCurrency: '', fee: 0});
        setIsEditing(false);
        setError(null);
    };

    const handleAxiosError = (error: any): string => {
        const response = error.response;
        if (response?.data?.errors) {
            return Object.entries(response.data.errors)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        }
        return response?.data?.message || 'Unknown error';
    };

    const handleAddOrUpdateFee = () => {
        const action = isEditing && currentFee.id
            ? feeService.updateFee(currentFee.id, currentFee)
            : feeService.addFee(currentFee)

        action
            .then(() => {
                resetForm();
                loadFees()
            })
            .catch(error => setError(`Error saving fee: ${handleAxiosError(error)}`));
    };

    const deleteFee = (id: number) => {
        feeService.deleteFee(id)
            .then(() => loadFees())
            .catch(error => setError(`Error deleting fee: ${handleAxiosError(error)}`));
    };

    const handleFeeChange = (fee: Fee) => {
        setCurrentFee(fee);
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Fee) => {
        const value = field === 'fee' ? parseFloat(e.target.value) : e.target.value.toUpperCase();
        setCurrentFee(prev => ({...prev, [field]: value}));
    };

    return (
        <div style={{padding: '20px'}}>
            <h2 style={{marginBottom: '20px'}}>Manage Conversion Fees</h2>
            {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="From Currency"
                    value={currentFee.fromCurrency || ''}
                    onChange={(e) => handleInputChange(e, 'fromCurrency')}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                />
                <input
                    type="text"
                    placeholder="To Currency"
                    value={currentFee.toCurrency || ''}
                    onChange={(e) => handleInputChange(e, 'toCurrency')}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                />
                <input
                    type="number"
                    step="0.1"
                    placeholder="Fee"
                    value={currentFee.fee || 0}
                    onChange={(e) => handleInputChange(e, 'fee')}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                />
                <button onClick={handleAddOrUpdateFee}>
                    {isEditing ? 'Update Fee' : 'Add Fee'}
                </button>
                <button onClick={resetForm}
                        style={{marginLeft: '10px'}}>
                    Cancel
                </button>
            </div>
            <ul>
                {fees.map((fee) => (
                    <li key={fee.id} style={{marginBottom: '10px'}}>
                        {fee.fromCurrency} to {fee.toCurrency}: {fee.fee.toFixed(2)} {}
                        <button onClick={() => handleFeeChange(fee)} style={{marginLeft: '10px'}}>Edit</button>
                        <button onClick={() => deleteFee(fee.id)} style={{marginLeft: '10px'}}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminFeeManagement;
