'use client'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from '../../db/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function LoginForm() {
    const router = useRouter();
    const inputsSchema = z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters')
    })

    type Inputs = z.infer<typeof inputsSchema>

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(inputsSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { email, password } = data;
        const { error } = await supabase().auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error('Login Failed: ', error.message);
            return;
        }
        router.push('/dashboard');
    }

    return (
        <form className='text-center' onSubmit={handleSubmit(onSubmit)}>
            <input {...register('email')} type='email' placeholder='enter your email' />
            <p>{errors.email?.message}</p>
            <input {...register('password')} type='password' placeholder='enter your password' />
            <p>{errors.password?.message}</p>
            <input type='submit' value='Log In' />
            <div>
                <Link href='/signup'>Not a member? Sign Up !</Link>
            </div>
        </form>
    )
}