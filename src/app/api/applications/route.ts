
import { db } from '@/index'
import { applications } from '@/db/schema'
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const allApps = await db.select().from(applications);
    return NextResponse.json(allApps);
}

export async function POST(request: Request) {

}

export async function PATCH(request: Request) {

}

export async function DELETE(request: Request) {

}