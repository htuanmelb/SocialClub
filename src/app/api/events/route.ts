import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allEvents = await db.select().from(events).orderBy(desc(events.eventDate));
    return NextResponse.json(allEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, eventDate, location, maxAttendees, isPublic, memberOnly } = body;

    if (!title || !description || !eventDate) {
      return NextResponse.json({ error: "Title, description, and event date are required" }, { status: 400 });
    }

    const [newEvent] = await db
      .insert(events)
      .values({
        title,
        description,
        eventDate: new Date(eventDate),
        location: location || null,
        maxAttendees: maxAttendees || null,
        isPublic: isPublic ?? true,
        memberOnly: memberOnly ?? false,
      })
      .returning();

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
