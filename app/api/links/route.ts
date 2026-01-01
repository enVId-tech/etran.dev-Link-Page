import { connectToDatabase } from "@/app/utils/db";
import { NextResponse } from "next/server";

export const revalidate = 1800;

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const collection = db.collection("links");

        const links = await collection.find().toArray()

        return NextResponse.json(
            {
                success: true,
                links: links || []
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
                },
            }
        )
    } catch (err: unknown) {
        console.error(`An error has occured fetching links: ${err as string}`)
        return NextResponse.json(
            { success: false, error: `Failed to fetch links: ${err as string}` },
            { status: 500 }
        )
    }
}