import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api/axios.js';

const PayslipDetailPage = () => {
    const { id } = useParams(); // Gets the payslip ID from the URL
    const [payslip, setPayslip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(`/api/payslips/${id}`);
                setPayslip(response.data);
            } catch (err) {
                setError('Failed to fetch payslip details.');
                console.error(err);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return <p>Loading payslip...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!payslip) return <p>Payslip not found.</p>;

    // Helper to filter components
    const allowances = payslip.components.filter(c => c.type === 'allowance');
    const deductions = payslip.components.filter(c => c.type === 'deduction');

    return (
        <div>
            <Link to={`/payroll/${payslip.payroll_run_id}`}>&larr; Back to Payroll Run</Link>
            
            {/* --- Printable Payslip --- */}
            <div style={{ 
                width: '800px', margin: '20px auto', padding: '30px', 
                border: '1px solid #ddd', background: 'white' 
            }}>
                <h2 style={{ textAlign: 'center', margin: 0 }}>Payslip</h2>
                <p style={{ textAlign: 'center', margin: 0 }}>{payslip.payroll_run.title}</p>
                <hr style={{ margin: '20px 0' }} />

                {/* --- Employee Details --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <strong>Employee:</strong> {payslip.employee.person.first_name} {payslip.employee.person.last_name}<br />
                        <strong>Position:</strong> {payslip.employee.position.title}<br />
                        <strong>Department:</strong> {payslip.employee.department.name}<br />
                    </div>
                    <div>
                        <strong>Pay Period:</strong> {payslip.payroll_run.start_date} to {payslip.payroll_run.end_date}<br />
                        <strong>Employee ID:</strong> {payslip.employee.employee_no}<br />
                        <strong>Contract:</strong> {payslip.employee.contract_type}<br />
                    </div>
                </div>

                <hr style={{ margin: '20px 0' }} />

                {/* --- Earnings & Deductions --- */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Allowances */}
                    <div style={{ flex: 1 }}>
                        <h4>Earnings</h4>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr>
                                    <td>Base Salary</td>
                                    <td style={{ textAlign: 'right' }}>${parseFloat(payslip.gross_salary - payslip.total_allowances).toFixed(2)}</td>
                                </tr>
                                {allowances.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td style={{ textAlign: 'right' }}>${parseFloat(item.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot style={{ borderTop: '2px solid #333' }}>
                                <tr>
                                    <td><strong>Total Gross Salary</strong></td>
                                    <td style={{ textAlign: 'right' }}><strong>${parseFloat(payslip.gross_salary).toFixed(2)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {/* Deductions */}
                    <div style={{ flex: 1 }}>
                        <h4>Deductions</h4>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                {deductions.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td style={{ textAlign: 'right' }}>(${parseFloat(item.amount).toFixed(2)})</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot style={{ borderTop: '2.5px solid #333' }}>
                                <tr>
                                    <td><strong>Total Deductions</strong></td>
                                    <td style={{ textAlign: 'right' }}><strong>(${parseFloat(payslip.total_deductions).toFixed(2)})</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                <hr style={{ margin: '20px 0' }} />

                {/* --- Net Pay --- */}
                <div style={{ background: '#eee', padding: '20px', textAlign: 'center' }}>
                    <h3 style={{ margin: 0 }}>Net Pay</h3>
                    <h2 style={{ margin: '10px 0', fontSize: '32px' }}>
                        ${parseFloat(payslip.net_salary).toFixed(2)}
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default PayslipDetailPage;