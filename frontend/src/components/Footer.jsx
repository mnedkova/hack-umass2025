export default function Footer() {
  return (
    <footer className="relative w-full text-white overflow-hidden">
      {/* Background Image */}
      <img
        src="/Background.jpg" // your image in public/Background.jpg
        alt="Footer background"
        className="absolute inset-0 w-full h-full object-cover opacity-100"
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-12 bg-black/50 backdrop-blur-sm">
        {/* About Section */}
        <div className="mb-8 md:mb-0 md:w-1/2">
          <h2 className="text-2xl font-semibold mb-3">About</h2>
          <p className="text-gray-200 max-w-md">
            Welcome to CSChat! We hope that this AI tool can help you succeed in your classes. Please use responsibly.
          </p>
        </div>

        {/* Contact Section */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold mb-3">Contact</h2>
          <p className="text-gray-200">
            Email:{" "}
            <a href="mailto:contact@example.com" className="underline">
              contact@example.com
            </a>
          </p>
          <p className="text-gray-200 mt-2">
            University of Massachusetts Amherst
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 text-center py-4 bg-black/70 text-gray-300 text-sm">
        © {new Date().getFullYear()} CSChat. All rights reserved.
      </div>
    </footer>
  );
}