
import { db } from '@/index'
import { applications } from '@/db/schema'
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm'

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
    const body = await request.json();
    const id = body.id;
    const field = body.field;
    const value = body.value;
    switch (field) {
        case 'title':
            await db.update(applications).set({ jobTitle: value }).where(eq(applications.id, id));
            break;
        case 'company':
            await db.update(applications).set({ company: value }).where(eq(applications.id, id));
            break;
        case 'status':
            await db.update(applications).set({ status: value }).where(eq(applications.id, id));
            break;
        case 'notes':
            await db.update(applications).set({ notes: value }).where(eq(applications.id, id));
            break;
        case 'date_applied':
            await db.update(applications).set({ dateApplied: value }).where(eq(applications.id, id));
            break;
        default:
            return new NextResponse(JSON.stringify({ error: 'Invalid field' }), { status: 400 });
    }
    return new NextResponse(JSON.stringify({ message: 'Application updated' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        if (!body.id) {
            return new NextResponse(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
        }

        await db.delete(applications).where(eq(applications.id, body.id));

        return new NextResponse(JSON.stringify({ message: 'Application deleted' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new NextResponse(JSON.stringify({ error: 'Server error', details: err }), { status: 500 });
    }

}