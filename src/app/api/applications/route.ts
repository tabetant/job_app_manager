
import { db } from '@/index'
import { applications } from '@/db/schema'
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const allApps = await db.select().from(applications);
    return NextResponse.json(allApps);
}

export async function POST(request: Request) {
    if (!request.body) return;
    const body = await request.json();
    const jobTitle = body.jobTitle as string;
    const dateApplied = new Date(body.dateApplied).toISOString().slice(0, 10); // 'YYYY-MM-DD'
    const company = body.company as string;
    const status = body.status as "applied" | "interview" | "offer" | "rejected";
    const notes = body.notes as string;

    await db.insert(applications).values({
        jobTitle,
        company,
        dateApplied,
        status,
        notes,
    })
    return new NextResponse(JSON.stringify({ message: 'Application created' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function PATCH(request: Request) {

}

export async function DELETE(request: Request) {

}