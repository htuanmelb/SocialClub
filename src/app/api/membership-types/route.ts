import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { membershipTypes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const types = await db
      .select()
      .from(membershipTypes)
      .where(eq(membershipTypes.isActive, true));
    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching membership types:", error);
    return NextResponse.json({ error: "Failed to fetch membership types" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, duration, benefits } = body;

    if (!name || !description || price === undefined || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [newType] = await db
      .insert(membershipTypes)
      .values({
        name,
        description,
        price,
        duration,
        benefits: Array.isArray(benefits) ? JSON.stringify(benefits) : benefits,
      })
      .returning();

    return NextResponse.json(newType, { status: 201 });
  } catch (error) {
    console.error("Error creating membership type:", error);
    return NextResponse.json({ error: "Failed to create membership type" }, { status: 500 });
  }
}
