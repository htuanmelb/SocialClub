import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members, membershipTypes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    const [member] = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        phone: members.phone,
        dateOfBirth: members.dateOfBirth,
        address: members.address,
        city: members.city,
        state: members.state,
        zipCode: members.zipCode,
        country: members.country,
        bio: members.bio,
        interests: members.interests,
        membershipStatus: members.membershipStatus,
        memberNumber: members.memberNumber,
        membershipTypeId: members.membershipTypeId,
        membershipStartDate: members.membershipStartDate,
        membershipEndDate: members.membershipEndDate,
        isAdmin: members.isAdmin,
        notes: members.notes,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
        membershipTypeName: membershipTypes.name,
      })
      .from(members)
      .leftJoin(membershipTypes, eq(members.membershipTypeId, membershipTypes.id))
      .where(eq(members.id, memberId));

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    const body = await request.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
      "bio",
      "interests",
      "membershipTypeId",
      "membershipStatus",
      "membershipStartDate",
      "membershipEndDate",
      "isAdmin",
      "notes",
    ];

    for (const field of allowedFields) {
      if (field in body) {
        if (field === "interests" && Array.isArray(body[field])) {
          updateData[field] = JSON.stringify(body[field]);
        } else {
          updateData[field] = body[field];
        }
      }
    }

    const [updated] = await db
      .update(members)
      .set(updateData)
      .where(eq(members.id, memberId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    const [deleted] = await db
      .delete(members)
      .where(eq(members.id, memberId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
