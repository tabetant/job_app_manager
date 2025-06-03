'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation'
type Job = {
    id: number,
    jobTitle: string,
    company: string,
    dateApplied: string,
    status: 'applied' | 'rejected' | 'offer' | 'interview',
    notes: string,
}

export default function JobForm() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('applied');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [applications, setApplications] = useState<Job[]>([]);
    const [edits, setEdits] = useState<{ [id: number]: { field: string, value: string } }>({});

    const fetchApps = async () => {
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

    useEffect(() => { fetchApps(); }, []);

    useEffect(() => {
        setLoading(true);
        supabase().auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push('/login');
            }
        })
        setLoading(false);
    }, [])

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
            fetchApps();
            console.log('Job added successfully');
        } else {
            console.error('Failed to submit');
        }
    }

    async function deleteApp(job: Job) {
        const res = await fetch('/api/applications', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: job.id })
        })
        if (res.ok) {
            fetchApps(); // ✅ reload the list after successful delete
        } else {
            console.error('Failed to delete application');
        }
    }

    async function editApp(id: number) {
        const field = edits[id].field;
        const value = edits[id].value;
        fetch('/api/applications', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                field: field,
                value: value,
            })
        })
        fetchApps();
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
                        <th className='px-4 py-2'>Delete</th>
                        <th className='px-4 py-2'>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        applications.map(app => (
                            <tr key={app.id}>
                                <td>{app.jobTitle}</td>
                                <td>{app.company}</td>
                                <td>{app.dateApplied}</td>
                                <td>{app.status}</td>
                                <td>{app.notes}</td>
                                <td><button type='button' onClick={() => deleteApp(app)}>Delete</button></td>
                                <td>
                                    <select onChange={(e) => setEdits(prev => ({ ...prev, [app.id]: { ...prev[app.id], field: e.target.value, } }))}>
                                        <option value='title'>title</option>
                                        <option value='company'>company</option>
                                        <option value='status'>status</option>
                                        <option value='notes'>notes</option>
                                        <option value='date_applied'>date applied</option>
                                    </select>
                                    <input onChange={(e) => setEdits(prev => ({ ...prev, [app.id]: { ...prev[app.id], value: e.target.value } }))} type={edits[app.id]?.field == 'date_applied' ? 'date' : 'text'} name='new_value' placeholder='enter new value' />
                                    <button type='button' onClick={() => editApp(app.id)}>Edit Application</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table >
            <button onClick={async () => { await supabase().auth.signOut(); router.push('/login') }}>Sign Out</button>
        </>
    );
}