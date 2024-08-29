import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface Fee {
    id: number;
    fromCurrency: string;
    toCurrency: string;
    fee: number;
}

const AdminFeeManagement: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [newFee, setNewFee] = useState<Partial<Fee>>({
        fromCurrency: '',
        toCurrency: '',
        fee: 0
    });
    const [editingFee, setEditingFee] =
        useState<Partial<Fee> | null>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFees = () => {
            axios.get<Fee[]>('/admin/fees')
                .then(response => {
                    setFees(response.data);
                })
                .catch(error => {
                    console.error('Error fetching fees:', error);
                });
        };
        fetchFees();
    }, []);

    const addFee = async () => {
        axios.post('/admin/fees', newFee)
            .then(() => {
                setNewFee({fromCurrency: '', toCurrency: '', fee: 0});
                return axios.get<Fee[]>('/admin/fees');
            })
            .then(response => {
                setFees(response.data);
                setError(null);
            })
            .catch(error => {
                setError(error.response?.data?.message || 'An unexpected error occurred');
            });
    };

    const updateFee = () => {
        if (editingFee && editingFee.id) {
            axios.put(`/admin/fees/${editingFee.id}`, editingFee)
                .then(() => {
                    setEditingFee(null);
                    setNewFee({fromCurrency: '', toCurrency: '', fee: 0});
                    return axios.get<Fee[]>('/admin/fees');
                })
                .then(response => {
                    setFees(response.data);
                })
                .catch(error => {
                    console.error('Error updating fee:', error);
                });
        }
    };

    const deleteFee = async (id: number) => {
        axios.delete(`/admin/fees/${id}`)
            .then(() => {
                return axios.get<Fee[]>('/admin/fees');
            })
            .then(response => {
                setFees(response.data);
            })
            .catch(error => {
                console.error('Error deleting fee:', error);
            });
    };

    const handleFeeChange = (fee: Fee) => {
        setEditingFee(fee);
        setNewFee({
            fromCurrency: fee.fromCurrency,
            toCurrency: fee.toCurrency,
            fee: fee.fee
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Fee) => {
        const value = field === 'fee' ? parseFloat(e.target.value) : e.target.value.toUpperCase();

        if (editingFee) {
            setEditingFee(prev => prev ? {...prev, [field]: value} : null);
        } else {
            setNewFee(prev => ({...prev, [field]: value}));
        }
    };

    return (
        <div style={{padding: '20px'}}>
            <h2 style={{marginBottom: '20px'}}>Manage Conversion Fees</h2>
            <div style={{marginBottom: '20px'}}>
                <input
                    type="text"
                    placeholder="From Currency"
                    value={(editingFee ? editingFee.fromCurrency : newFee.fromCurrency) || ''}
                    onChange={(e) => handleInputChange(e, 'fromCurrency')}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                />
                <input
                    type="text"
                    placeholder="To Currency"
                    value={(editingFee ? editingFee.toCurrency : newFee.toCurrency) || ''}
                    onChange={(e) => handleInputChange(e, 'toCurrency')}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                />
                <input
                    type="number"
                    step="0.1"
                    placeholder="Fee"
                    value={(editingFee ? editingFee.fee : newFee.fee) || 0}
                    onChange={(e) => handleInputChange(e, 'fee')}
                    style={{marginRight: '10px', marginBottom: '10px'}}
                />
                {editingFee ? (
                    <button onClick={updateFee}>Update Fee</button>
                ) : (
                    <button onClick={addFee}>Add Fee</button>
                )}
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
