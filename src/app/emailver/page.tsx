'use client'
import { useRouter } from 'next/navigation'
export default function EmailVer() {
    const router = useRouter();
    return (
        <>
            <div className='text-center text-5xl font-bold'>
                Check your email address to verify your email, then Log In!
            </div>
            <button className='text-center' onClick={() => router.push('/login')}>Login</button>
        </>
    )
}