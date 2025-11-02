import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios.js';

const PayrollRunDetailPage = () => {
    // This hook gets the '{id}' from the URL
    const { id } = useParams();
    
    const [run, setRun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the single payroll run by its ID
                const response = await apiClient.get(`/api/payroll-runs/${id}`);
                setRun(response.data);
            } catch (err) {
                setError('Failed to fetch payroll run details.');
                console.error(err);
            }
            setLoading(false);
        };

        fetchData();
    }, [id]); // Re-run if the ID in the URL changes

    if (loading) return <p>Loading details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!run) return <p>Payroll run not found.</p>;

    return (
        <div>
            <Link to="/payroll">&larr; Back to all payroll runs</Link>
            
            <h2 style={{ marginTop: '20px' }}>{run.title}</h2>
            <p><strong>Status:</strong> {run.status}</p>
            <p><strong>Period:</strong> {run.start_date} to {run.end_date}</p>
            
            <hr style={{ margin: '20px 0' }} />

            <h3>Generated Payslips ({run.payslips.length})</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Employee</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Gross Salary</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Total Deductions</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd' }}>Net Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {run.payslips.map((payslip) => (
                        <tr key={payslip.id}>
                           <td style={{ padding: '8px', border: '1px solid #ddd' }}>
    <Link to={`/payroll/payslip/${payslip.id}`}>
        {payslip.employee.person.first_name} {payslip.employee.person.last_name}
    </Link>
</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                ${parseFloat(payslip.gross_salary).toFixed(2)}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                ${parseFloat(payslip.total_deductions).toFixed(2)}
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <strong>${parseFloat(payslip.net_salary).toFixed(2)}</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PayrollRunDetailPage;