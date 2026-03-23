import { db } from "@/db";
import { members, membershipTypes, events } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import SeedButton from "./SeedButton";

async function getDashboardData() {
  try {
    const [total] = await db.select({ count: count() }).from(members);
    const [active] = await db.select({ count: count() }).from(members).where(eq(members.membershipStatus, "active"));
    const [pending] = await db.select({ count: count() }).from(members).where(eq(members.membershipStatus, "pending"));
    const [expired] = await db.select({ count: count() }).from(members).where(eq(members.membershipStatus, "expired"));
    const [totalEvents] = await db.select({ count: count() }).from(events);

    const recentMembers = await db
      .select({
        id: members.id,
        firstName: members.firstName,
        lastName: members.lastName,
        email: members.email,
        membershipStatus: members.membershipStatus,
        memberNumber: members.memberNumber,
        createdAt: members.createdAt,
        membershipTypeName: membershipTypes.name,
      })
      .from(members)
      .leftJoin(membershipTypes, eq(members.membershipTypeId, membershipTypes.id))
      .orderBy(members.createdAt)
      .limit(10);

    return {
      stats: {
        total: total.count,
        active: active.count,
        pending: pending.count,
        expired: expired.count,
        events: totalEvents.count,
      },
      recentMembers: recentMembers.reverse(),
    };
  } catch {
    return { stats: { total: 0, active: 0, pending: 0, expired: 0, events: 0 }, recentMembers: [] };
  }
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  expired: "bg-gray-100 text-gray-600",
  suspended: "bg-red-100 text-red-700",
};

export default async function AdminPage() {
  const { stats, recentMembers } = await getDashboardData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage club memberships and members</p>
        </div>
        <div className="flex gap-3">
          <SeedButton />
          <Link
            href="/admin/members"
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium text-sm"
          >
            All Members
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: "Total Members", value: stats.total, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Active", value: stats.active, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Expired", value: stats.expired, color: "text-gray-600", bg: "bg-gray-100" },
          { label: "Events", value: stats.events, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5`}>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link
          href="/register"
          className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-indigo-200 transition-colors">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Add New Member</h3>
          <p className="text-sm text-gray-500 mt-1">Register a new club member</p>
        </Link>

        <Link
          href="/admin/members"
          className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-violet-200 transition-colors">
            <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Manage Members</h3>
          <p className="text-sm text-gray-500 mt-1">View, edit, and manage all members</p>
        </Link>

        <Link
          href="/members"
          className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-200 transition-colors">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">View Directory</h3>
          <p className="text-sm text-gray-500 mt-1">Public member directory view</p>
        </Link>
      </div>

      {/* Recent Members */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Members</h2>
          <Link href="/admin/members" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all →
          </Link>
        </div>

        {recentMembers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No members yet. Click &quot;Seed Data&quot; to add sample data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Member #</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Joined</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-400">{member.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {member.memberNumber ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member.membershipTypeName ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          STATUS_STYLES[member.membershipStatus] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {member.createdAt
                        ? new Date(member.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
