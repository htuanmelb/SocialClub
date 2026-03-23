"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MemberRow = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  membershipStatus: string;
  memberNumber: string | null;
  membershipTypeId: number | null;
  membershipStartDate: Date | null;
  membershipEndDate: Date | null;
  isAdmin: boolean;
  createdAt: Date | null;
  membershipTypeName: string | null;
};

type Plan = {
  id: number;
  name: string;
};

const STATUS_OPTIONS = ["all", "active", "pending", "expired", "suspended"];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  expired: "bg-gray-100 text-gray-600",
  suspended: "bg-red-100 text-red-700",
};

export default function AdminMembersClient({
  members,
  plans,
}: {
  members: MemberRow[];
  plans: Plan[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const filtered = members.filter((m) => {
    const matchSearch =
      !search ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.memberNumber?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchStatus = statusFilter === "all" || m.membershipStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipStatus: newStatus }),
    });
    router.refresh();
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or member number..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Showing {filtered.length} of {members.length} members
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Member #</th>
                <th className="px-6 py-3">Plan</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-400 text-sm">
                    No members match your filters
                  </td>
                </tr>
              ) : (
                filtered.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm flex-shrink-0">
                          {member.firstName[0]}{member.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                            {member.isAdmin && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Admin</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {member.memberNumber ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {member.membershipTypeName ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={member.membershipStatus}
                        onChange={(e) => handleStatusChange(member.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-indigo-500 ${
                          STATUS_STYLES[member.membershipStatus] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {["active", "pending", "expired", "suspended"].map((s) => (
                          <option key={s} value={s} className="bg-white text-gray-700">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {[member.city, member.state].filter(Boolean).join(", ") || "—"}
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
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/members/${member.id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
                          disabled={deletingId === member.id}
                          className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                        >
                          {deletingId === member.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
