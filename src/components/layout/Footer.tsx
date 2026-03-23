import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="font-bold text-xl text-white">VN50Up</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A vibrant community where connections are made, ideas are shared, and friendships are built.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link href="/members" className="text-sm hover:text-indigo-400 transition-colors">Member Directory</Link></li>
              <li><Link href="/register" className="text-sm hover:text-indigo-400 transition-colors">Join Now</Link></li>
              <li><Link href="/admin" className="text-sm hover:text-indigo-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@socialclub.example.com</li>
              <li>+1 (555) 123-4567</li>
              <li>12 Koonung St, Balwyn North 3104</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} VN50Up. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
