import { db } from "@/db";
import { members, membershipTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import AdminMembersClient from "./AdminMembersClient";

async function getAllMembers() {
  try {
    return await db
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
        isAdmin: members.isAdmin,
        createdAt: members.createdAt,
        membershipTypeName: membershipTypes.name,
      })
      .from(members)
      .leftJoin(membershipTypes, eq(members.membershipTypeId, membershipTypes.id))
      .orderBy(members.createdAt);
  } catch {
    return [];
  }
}

async function getMembershipTypes() {
  try {
    return await db.select().from(membershipTypes);
  } catch {
    return [];
  }
}

export default async function AdminMembersPage() {
  const [allMembers, plans] = await Promise.all([getAllMembers(), getMembershipTypes()]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Members</h1>
          <p className="text-gray-500 mt-1">{allMembers.length} total members</p>
        </div>
      </div>

      <AdminMembersClient members={allMembers.reverse()} plans={plans} />
    </div>
  );
}
