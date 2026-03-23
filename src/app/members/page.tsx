import { db } from "@/db";
import { members, membershipTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import MemberSearch from "./MemberSearch";

type MemberRow = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string | null;
  state: string | null;
  membershipStatus: string;
  memberNumber: string | null;
  bio: string | null;
  interests: string | null;
  membershipTypeName: string | null;
};

async function getMembers(): Promise<MemberRow[]> {
  try {
    const rows = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        city: members.city,
        state: members.state,
        membershipStatus: members.membershipStatus,
        memberNumber: members.memberNumber,
        bio: members.bio,
        interests: members.interests,
        membershipTypeName: membershipTypes.name,
      })
      .from(members)
      .leftJoin(membershipTypes, eq(members.membershipTypeId, membershipTypes.id))
      .where(eq(members.membershipStatus, "active"));
    return rows;
  } catch {
    return [];
  }
}

function getInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-cyan-500",
];

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const allMembers = await getMembers();
  const search = params.search?.toLowerCase() ?? "";

  const filtered = search
    ? allMembers.filter(
        (m) =>
          m.firstName.toLowerCase().includes(search) ||
          m.lastName.toLowerCase().includes(search) ||
          (m.city?.toLowerCase().includes(search) ?? false) ||
          (m.membershipTypeName?.toLowerCase().includes(search) ?? false)
      )
    : allMembers;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Member Directory</h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} active {filtered.length === 1 ? "member" : "members"}
          </p>
        </div>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium text-sm whitespace-nowrap"
        >
          + Join Club
        </Link>
      </div>

      <MemberSearch initialSearch={search} />

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          {search ? (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No members found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your search term</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No members yet</h3>
              <p className="text-gray-400 text-sm mb-6">Be the first to join!</p>
              <Link href="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 font-medium text-sm">
                Register Now
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((member, idx) => {
            const interests: string[] = member.interests ? JSON.parse(member.interests) : [];
            const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            return (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className={`h-20 ${colorClass} opacity-80`} />
                <div className="px-5 pb-5 -mt-8">
                  <div
                    className={`w-16 h-16 rounded-2xl ${colorClass} flex items-center justify-center text-white font-bold text-xl shadow-md mb-3 border-4 border-white`}
                  >
                    {getInitials(member.firstName, member.lastName)}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </h3>
                  {(member.city || member.state) && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {[member.city, member.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {member.membershipTypeName && (
                    <span className="inline-block mt-2 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      {member.membershipTypeName}
                    </span>
                  )}
                  {member.bio && (
                    <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2">
                      {member.bio}
                    </p>
                  )}
                  {interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                      {interests.length > 3 && (
                        <span className="text-xs text-gray-400">+{interests.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
