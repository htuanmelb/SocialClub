import { NextResponse } from "next/server";
import { db } from "@/db";
import { membershipTypes, events } from "@/db/schema";

export async function POST() {
  try {
    // Seed membership types
    const existingTypes = await db.select().from(membershipTypes);
    if (existingTypes.length === 0) {
      await db.insert(membershipTypes).values([
        {
          name: "Basic",
          description: "Perfect for those just getting started",
          price: 0,
          duration: 12,
          benefits: JSON.stringify([
            "Access to member directory",
            "Monthly newsletter",
            "Community forum access",
          ]),
          isActive: true,
        },
        {
          name: "Standard",
          description: "Our most popular membership tier",
          price: 49.99,
          duration: 12,
          benefits: JSON.stringify([
            "All Basic benefits",
            "Priority event registration",
            "Member-only events",
            "Exclusive resources library",
            "Monthly virtual meetups",
          ]),
          isActive: true,
        },
        {
          name: "Premium",
          description: "Unlock the full club experience",
          price: 99.99,
          duration: 12,
          benefits: JSON.stringify([
            "All Standard benefits",
            "VIP event access",
            "One-on-one mentorship",
            "Private networking groups",
            "Early access to club announcements",
            "Free guest passes (2/year)",
          ]),
          isActive: true,
        },
      ]);
    }

    // Seed events
    const existingEvents = await db.select().from(events);
    if (existingEvents.length === 0) {
      const now = new Date();
      await db.insert(events).values([
        {
          title: "Annual Club Gala",
          description: "Join us for our spectacular annual gala featuring live music, dinner, and networking opportunities with fellow members.",
          eventDate: new Date(now.getFullYear(), now.getMonth() + 2, 15),
          location: "Grand Ballroom, City Hotel",
          maxAttendees: 200,
          isPublic: false,
          memberOnly: true,
        },
        {
          title: "New Member Welcome Mixer",
          description: "A casual gathering for new and existing members to meet, mingle, and learn about all the club has to offer.",
          eventDate: new Date(now.getFullYear(), now.getMonth() + 1, 8),
          location: "Club Headquarters Lounge",
          maxAttendees: 50,
          isPublic: true,
          memberOnly: false,
        },
        {
          title: "Professional Development Workshop",
          description: "An intensive workshop focused on leadership skills, networking strategies, and career advancement.",
          eventDate: new Date(now.getFullYear(), now.getMonth() + 1, 22),
          location: "Virtual (Zoom)",
          maxAttendees: 100,
          isPublic: false,
          memberOnly: true,
        },
      ]);
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
