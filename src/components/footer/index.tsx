export function Footer() {
  return (
    <footer className="bg-[#7D8D86]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between gap-8">

        {/* Left */}
        <div>
          <h3 className="text-lg font-semibold text-[#F1F0E4] mb-4">
            Opening Hours
          </h3>
          <ul className="text-sm space-y-2 text-[#F1F0E4]">
            <li>Monday – Thursday : 10.00 AM – 10.00 PM</li>
            <li>Friday – Saturday : 01.00 PM – 09.00 PM</li>
            <li>Sunday : Closed</li>
          </ul>
        </div>

        {/* Right */}
        <div className="text-sm md:text-right text-[#F1F0E4]">
          <h3 className="text-lg font-semibold text-[#F1F0E4] mb-4">
            Dawn Winery
          </h3>
          <p className="mb-2">
            123 Sunset Avenue, Aurora City, Indonesia
          </p>
          <p className="text-[#F1F0E4]">
            © {new Date().getFullYear()} Dawn Winery. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
