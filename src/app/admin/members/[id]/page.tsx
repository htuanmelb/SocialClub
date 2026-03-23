import { db } from "@/db";
import { members, membershipTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditMemberForm from "./EditMemberForm";

async function getMember(id: number) {
  const [member] = await db
    .select()
    .from(members)
    .where(eq(members.id, id));
  return member;
}

async function getPlans() {
  return await db.select().from(membershipTypes).where(eq(membershipTypes.isActive, true));
}

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const memberId = parseInt(id);

  const [member, plans] = await Promise.all([getMember(memberId), getPlans()]);

  if (!member) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/members" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Member
          </h1>
          <p className="text-gray-500 mt-1">
            {member.firstName} {member.lastName} — {member.memberNumber}
          </p>
        </div>
      </div>

      <EditMemberForm member={member} plans={plans} />
    </div>
  );
}
