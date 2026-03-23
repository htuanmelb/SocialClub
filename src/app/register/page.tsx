import { db } from "@/db";
import { membershipTypes } from "@/db/schema";
import { eq } from "drizzle-orm";
import RegisterForm from "./RegisterForm";

async function getMembershipTypes() {
  try {
    return await db.select().from(membershipTypes).where(eq(membershipTypes.isActive, true));
  } catch {
    return [];
  }
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const plans = await getMembershipTypes();
  const preselectedPlan = params.plan ? parseInt(params.plan) : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join VN50Up</h1>
          <p className="text-gray-500 mt-2">Fill in your details below to create your membership</p>
        </div>
        <RegisterForm plans={plans} preselectedPlan={preselectedPlan} />
      </div>
    </div>
  );
}
