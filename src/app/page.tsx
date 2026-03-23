import Link from "next/link";
import { db } from "@/db";
import { members, membershipTypes, events } from "@/db/schema";
import { eq, count } from "drizzle-orm";

async function getStats() {
  try {
    const [totalMembers] = await db.select({ count: count() }).from(members);
    const [activeMembers] = await db
      .select({ count: count() })
      .from(members)
      .where(eq(members.membershipStatus, "active"));
    const [totalEvents] = await db.select({ count: count() }).from(events);
    const types = await db.select().from(membershipTypes).where(eq(membershipTypes.isActive, true));
    return {
      total: totalMembers.count,
      active: activeMembers.count,
      events: totalEvents.count,
      types,
    };
  } catch {
    return { total: 0, active: 0, events: 0, types: [] };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Now accepting new members
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-indigo-300">VN50Up</span>
          </h1>
          <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            A vibrant community where connections are made, ideas are shared, and lasting friendships are built. Join thousands of members from all walks of life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-indigo-900 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg"
            >
              Join Our Community
            </Link>
            <Link
              href="/members"
              className="border border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              Browse Members
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-600">{stats.total.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Total Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{stats.active.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Active Members</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{stats.events.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Events Hosted</div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Membership Plans</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Choose the plan that fits your lifestyle. All memberships include access to our growing community of engaged, like-minded individuals.</p>
        </div>

        {stats.types.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Membership plans are being set up.</p>
            <form action="/api/seed" method="post">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Initialize Club Data
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.types.map((type, i) => {
              const benefits: string[] = JSON.parse(type.benefits);
              const isPopular = i === 1;
              return (
                <div
                  key={type.id}
                  className={`relative rounded-2xl p-8 flex flex-col ${
                    isPopular
                      ? "bg-indigo-600 text-white shadow-2xl scale-105"
                      : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-1 ${isPopular ? "text-white" : "text-gray-900"}`}>
                    {type.name}
                  </h3>
                  <p className={`text-sm mb-6 ${isPopular ? "text-indigo-200" : "text-gray-500"}`}>
                    {type.description}
                  </p>
                  <div className="mb-6">
                    <span className={`text-4xl font-bold ${isPopular ? "text-white" : "text-gray-900"}`}>
                      {type.price === 0 ? "Free" : `$${type.price}`}
                    </span>
                    {type.price > 0 && (
                      <span className={`text-sm ml-1 ${isPopular ? "text-indigo-200" : "text-gray-500"}`}>
                        / {type.duration} months
                      </span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <svg
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isPopular ? "text-indigo-200" : "text-indigo-600"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={isPopular ? "text-indigo-100" : "text-gray-600"}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/register?plan=${type.id}`}
                    className={`text-center py-3 rounded-xl font-semibold transition-all ${
                      isPopular
                        ? "bg-white text-indigo-600 hover:bg-indigo-50"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Join VN50Up?</h2>
            <p className="text-gray-500">Everything you need to connect, grow, and thrive.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "👥",
                title: "Vibrant Community",
                desc: "Connect with a diverse group of passionate individuals who share your interests.",
              },
              {
                icon: "🎉",
                title: "Exclusive Events",
                desc: "Access member-only galas, workshops, networking events, and social gatherings.",
              },
              {
                icon: "📚",
                title: "Resources Library",
                desc: "Gain access to curated resources, guides, and educational materials.",
              },
              {
                icon: "🤝",
                title: "Mentorship",
                desc: "Connect with experienced mentors and give back by mentoring others.",
              },
              {
                icon: "🌐",
                title: "Global Network",
                desc: "Expand your personal and professional network across borders.",
              },
              {
                icon: "📰",
                title: "Newsletter",
                desc: "Stay informed with our monthly newsletter featuring club news and highlights.",
              },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16 text-white text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Ready to Join?</h2>
        <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
          Registration takes less than 2 minutes. Start enjoying the benefits of membership today.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-indigo-600 font-semibold px-10 py-4 rounded-xl hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg"
        >
          Register Now — It&apos;s Free to Start
        </Link>
      </section>
    </main>
  );
}
