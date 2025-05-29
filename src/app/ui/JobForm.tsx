'use client';
import { useState, useEffect } from 'react';

export default function JobForm() {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('applied');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [applications, setApplications] = useState([]);

    const fetchEvents = async () => {
        setLoading(true);          // Optional: Show loading state
        setError('');              // Clear previous errors
        try {
            const res = await fetch(`/api/applications}`);
            if (!res.ok) {
                throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
            }
            const data = await res.json();
            setApplications(data);
        } catch (err: any) {
            console.error('Error fetching events:', err);
            setError(err.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobTitle: title, company,
                dateApplied: date, status, notes,
            })
        })
        if (res.ok) {
            // Reset form (optional)
            setTitle('');
            setCompany('');
            setDate('');
            setStatus('applied');
            setNotes('');
            console.log('Job added successfully');
        } else {
            console.error('Failed to submit');
        }
    }

    return (

        <>
            <h1>Job Form</h1>
            <form onSubmit={handleSubmit}>
                <input onChange={(e) => setTitle(e.target.value)} type='text' name='title' placeholder='Enter Job Title' />
                <input onChange={(e) => setCompany(e.target.value)} type='text' name='company' placeholder='Enter Company Name' />
                <input onChange={(e) => setDate(e.target.value)} type='date' name='date_applied' />
                <select onChange={(e) => setStatus(e.target.value)}>
                    <option value='applied'>Applied</option>
                    <option value='interview'>Interview</option>
                    <option value='offer'>Offer</option>
                    <option value='rejected'>Rejected</option>
                </select>
                <textarea onChange={(e) => setNotes(e.target.value)} name='notes' placeholder='enter your notes' />
            </form>
        </>
    );
}