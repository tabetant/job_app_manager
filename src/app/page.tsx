import Link from 'next/link'
export default function App() {
    return (
        <>
            <h1>Welcome to Job Applications Manager</h1>
            <Link href='/signup' className='hover:text-purple-500'>Sign Up</Link>
            <Link href='/login' className='hover:text-purple-500'>Log In</Link>
            <Link href='/dashboard' className='hover:text-purple-500'>Dashboard</Link>
        </>
    )
}