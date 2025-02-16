import { Book, User2, Bookmark, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1a4d6c] to-[#0f2d40] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Logo and About Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/kathavachak-95a17.appspot.com/o/dia-dark.png?alt=media&token=7de3d0eb-3da0-426e-876b-6e63474fc2cf"
                alt="DIA Logo"
                className="h-16 w-auto"
              />
              <div>
                <h4 className="font-semibold text-lg">Department of</h4>
                <h4 className="font-semibold text-lg">Indigenous Affairs</h4>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Preserving and promoting the rich cultural heritage of Arunachal
              Pradesh's indigenous communities through documentation,
              research, and cultural exchange programs.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-300 hover:text-teal-300 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-teal-300 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-teal-300 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Tribes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Tribal Festivals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Tribal Music
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Tribal Videos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-teal-300 transition-colors"
                >
                  Tribal Music
                </a>
              </li>
            </ul>
          </div>

          {/* Download App Section */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Download Our App</h4>
            <p className="text-gray-300 text-sm mb-6">
              Get the DIA mobile app to explore Arunachal's cultural heritage on the go.
            </p>
            <div className="space-y-4">
              <a
                href="https://apps.apple.com/in/app/indigenous-folklore-and-music/id6736680850"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on App Store"
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.arunanchal"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-10 w-auto"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8">
          <div className="text-center mb-6">
            <div className="inline-block flex gap-2 bg-white/10 rounded-lg px-6 py-3">
              <p className="text-teal-300 font-semibold">Total Visitors - </p>
              <p className="text-lg font-semibold text-white">12547</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              ©️ 2024 Department of Indigenous Affairs, Arunachal Pradesh. All Rights Reserved.
            </p>
            <div className="flex justify-center md:justify-end gap-8">
              <a
                href="#"
                className="text-gray-400 hover:text-teal-300 transition-colors text-sm"
              >
                Help Center
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-teal-300 transition-colors text-sm"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-teal-300 transition-colors text-sm"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}