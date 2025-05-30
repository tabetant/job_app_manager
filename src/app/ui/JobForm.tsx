'use client';
import { useState, useEffect } from 'react';

type Job = {
    id: number,
    title: string,
    company: string,
    dateApplied: string,
    status: 'applied' | 'rejected' | 'offer' | 'interview',
    notes: string,
}

export default function JobForm() {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('applied');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [applications, setApplications] = useState<Job[]>([]);

    const fetchEvents = async () => {
        setLoading(true);          // Optional: Show loading state
        setError('');              // Clear previous errors
        try {
            const res = await fetch('/api/applications', {
                method: 'GET',
            });
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
            fetchEvents();
            console.log('Job added successfully');
        } else {
            console.error('Failed to submit');
        }
    }

    return (

        <>
            <h1 className='text-center'>Job Form</h1>
            <form className='mx-auto' onSubmit={handleSubmit}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type='text' name='title' placeholder='Enter Job Title' />
                <input value={company} onChange={(e) => setCompany(e.target.value)} type='text' name='company' placeholder='Enter Company Name' />
                <input value={date} onChange={(e) => setDate(e.target.value)} type='date' name='date_applied' />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value='applied'>Applied</option>
                    <option value='interview'>Interview</option>
                    <option value='offer'>Offer</option>
                    <option value='rejected'>Rejected</option>
                </select>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} name='notes' placeholder='enter your notes' />
                <input type='submit' value='Add Application' />
            </form>
            <table className='mx-auto'>
                <thead>
                    <tr>
                        <th className='px-4 py-2'>Job Title</th>
                        <th className='px-4 py-2'>Company</th>
                        <th className='px-4 py-2'>Date Applied</th>
                        <th className='px-4 py-2'>Status</th>
                        <th className='px-4 py-2'>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        applications.map(app => (
                            <tr key={app.id}>
                                <td>{app.title}</td>
                                <td>{app.company}</td>
                                <td>{app.dateApplied}</td>
                                <td>{app.status}</td>
                                <td>{app.notes}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    );
}