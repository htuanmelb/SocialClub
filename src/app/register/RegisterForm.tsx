"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MembershipType = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  benefits: string;
};

const INTERESTS = [
  "Networking",
  "Technology",
  "Arts & Culture",
  "Sports & Fitness",
  "Travel",
  "Food & Dining",
  "Music",
  "Reading",
  "Volunteering",
  "Business",
  "Photography",
  "Gaming",
];

export default function RegisterForm({
  plans,
  preselectedPlan,
}: {
  plans: MembershipType[];
  preselectedPlan?: number;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [newMember, setNewMember] = useState<{ memberNumber: string; firstName: string } | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    bio: "",
    interests: [] as string[],
    membershipTypeId: preselectedPlan || (plans[0]?.id ?? ""),
  });

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleInterest = (interest: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          membershipTypeId: form.membershipTypeId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setNewMember({ memberNumber: data.memberNumber, firstName: data.firstName });
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success && newMember) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {newMember.firstName}!</h2>
        <p className="text-gray-500 mb-4">Your registration was successful.</p>
        <div className="bg-indigo-50 rounded-xl p-4 mb-6 inline-block">
          <p className="text-sm text-indigo-600 font-medium">Your Member Number</p>
          <p className="text-2xl font-bold text-indigo-900">{newMember.memberNumber}</p>
        </div>
        <p className="text-sm text-gray-400 mb-8">
          Please save your member number for future reference.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push("/members")}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 font-medium"
          >
            View Members
          </button>
          <button
            onClick={() => router.push("/")}
            className="border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-50 font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Progress indicator */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step === s
                    ? "bg-indigo-600 text-white"
                    : step > s
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > s ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === s ? "text-indigo-600" : "text-gray-400"}`}>
                {s === 1 ? "Personal Info" : s === 2 ? "Interests & Bio" : "Membership Plan"}
              </span>
              {s < 3 && <div className="h-px w-8 bg-gray-200 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="NY"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">ZIP</label>
                <input
                  type="text"
                  value={form.zipCode}
                  onChange={(e) => update("zipCode", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Interests & Bio */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Interests & About You</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Your Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      form.interests.includes(interest)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Short Bio <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Tell us a little about yourself, your background, and what you hope to get out of your membership..."
              />
              <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500 characters</p>
            </div>
          </div>
        )}

        {/* Step 3: Membership Plan */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose Your Membership Plan</h2>
            {plans.length === 0 ? (
              <p className="text-gray-500 text-sm">No membership plans available. You can still register and choose a plan later.</p>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => {
                  const benefits: string[] = JSON.parse(plan.benefits);
                  const isSelected = form.membershipTypeId === plan.id;
                  return (
                    <label
                      key={plan.id}
                      className={`block cursor-pointer rounded-xl border-2 p-5 transition-all ${
                        isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={isSelected}
                        onChange={() => update("membershipTypeId", plan.id)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="font-semibold text-gray-900">{plan.name}</span>
                          <p className="text-sm text-gray-500 mt-0.5">{plan.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <span className="text-xl font-bold text-gray-900">
                            {plan.price === 0 ? "Free" : `$${plan.price}`}
                          </span>
                          {plan.price > 0 && (
                            <div className="text-xs text-gray-500">{plan.duration} months</div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {benefits.slice(0, 3).map((b, i) => (
                          <span key={i} className="text-xs text-gray-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {b}
                          </span>
                        ))}
                        {benefits.length > 3 && (
                          <span className="text-xs text-indigo-500">+{benefits.length - 3} more</span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && (!form.firstName || !form.lastName || !form.email)) {
                  setError("Please fill in all required fields.");
                  return;
                }
                setError("");
                setStep(step + 1);
              }}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 font-medium text-sm"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl hover:bg-indigo-700 font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              Complete Registration
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
