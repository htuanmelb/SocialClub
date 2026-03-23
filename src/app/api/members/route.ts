import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members, membershipTypes } from "@/db/schema";
import { eq, like, or, desc } from "drizzle-orm";

function generateMemberNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `CLB-${year}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    let query = db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        phone: members.phone,
        city: members.city,
        state: members.state,
        membershipStatus: members.membershipStatus,
        memberNumber: members.memberNumber,
        membershipTypeId: members.membershipTypeId,
        membershipStartDate: members.membershipStartDate,
        membershipEndDate: members.membershipEndDate,
        bio: members.bio,
        interests: members.interests,
        isAdmin: members.isAdmin,
        createdAt: members.createdAt,
        membershipTypeName: membershipTypes.name,
      })
      .from(members)
      .leftJoin(membershipTypes, eq(members.membershipTypeId, membershipTypes.id))
      .orderBy(desc(members.createdAt));

    const allMembers = await query;

    let filtered = allMembers;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.firstName.toLowerCase().includes(s) ||
          m.lastName.toLowerCase().includes(s) ||
          m.email.toLowerCase().includes(s) ||
          (m.memberNumber?.toLowerCase().includes(s) ?? false)
      );
    }
    if (status) {
      filtered = filtered.filter((m) => m.membershipStatus === status);
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
      country,
      bio,
      interests,
      membershipTypeId,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await db.select().from(members).where(eq(members.email, email));
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 409 }
      );
    }

    const memberNumber = generateMemberNumber();
    const now = new Date();
    let endDate: Date | undefined;

    let membershipStart: Date | undefined;
    let membershipEnd: Date | undefined;

    if (membershipTypeId) {
      const [memType] = await db
        .select()
        .from(membershipTypes)
        .where(eq(membershipTypes.id, membershipTypeId));
      if (memType) {
        membershipStart = now;
        endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + memType.duration);
        membershipEnd = endDate;
      }
    }

    const [newMember] = await db
      .insert(members)
      .values({
        firstName,
        lastName,
        email,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        country: country || "US",
        bio: bio || null,
        interests: interests ? JSON.stringify(interests) : null,
        membershipTypeId: membershipTypeId || null,
        membershipStatus: membershipTypeId ? "active" : "pending",
        membershipStartDate: membershipStart,
        membershipEndDate: membershipEnd,
        memberNumber,
      })
      .returning();

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
