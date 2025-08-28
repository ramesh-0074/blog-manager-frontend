// src/components/layout/footer.tsx
import Link from "next/link";
import { FaGithub, FaLinkedin, FaMailBulk } from "react-icons/fa";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Blogs", href: "/blogs" },
];

const socialLinks = [
  { name: "Github", href: "https://github.com/ramesh-0074", icon: FaGithub },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/ramesh-pr/", icon: FaLinkedin },
  { name: "Email", href: "mailto:rameshrajendran5555@gmail.com", icon: FaMailBulk },
];

const legalLinks = [
  { name: "User Manual", href: "/user-manual" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 bottom-0 left-0 right-0">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              Blog Manager
            </Link>
            <p className="text-sm text-gray-400 max-w-xs">
              A modern platform for creating, managing, and sharing your
              thoughts with the world.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <nav className="space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <nav className="space-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              &copy; {currentYear} Blog Manager. All rights reserved.
            </div>

            <div className="text-sm text-gray-500">
              Built using{" "}
              <Link
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Next.js 15
              </Link>{" "}
              By{" "}
              <Link
                href="https://portofolio-oq2hr19ep-ramesh-0074s-projects.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ramesh P R
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
