export default function AboutPage(): React.ReactElement {
  return (
    <div className="min-h-screen">

      {/* Video Header */}
      <div className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white overflow-hidden">

        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/m.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-primary-700/60"></div>

        {/* Text */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl">Making a difference in the lives of the unfortunate</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">

          {/* Mission */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The General Givers Family Foundation is dedicated to inspire positive action and help create an
                environment of love, respect, and cooperation in our society.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We believe that every child deserves access to basic necessities, quality
              education, and opportunities to reach their full potential.
            </p>
          </section>

          {/* Vision */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              A world where every child has the opportunity to grow up in a safe, nurturing
              environment with access to education, healthcare, and the resources they need
              to build a brighter future.
            </p>
          </section>

          {/* What We Do */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Support</h3>
                <p className="text-gray-700">
                  Regular visits and donations to children&apos;s homes, providing essential
                  supplies, food, and clothing.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Education</h3>
                <p className="text-gray-700">
                  Scholarships and educational materials to ensure children have access to
                  quality learning opportunities.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Healthcare</h3>
                <p className="text-gray-700">
                  Medical support and health programs to ensure children receive proper
                  healthcare and nutrition.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Community Development</h3>
                <p className="text-gray-700">
                  Building sustainable programs that empower communities to support
                  vulnerable children.
                </p>
              </div>
            </div>
          </section>

          {/* Get Involved */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Join us in making a difference! Whether through donations, volunteering, or
              spreading awareness, your support helps us create lasting change in the lives
              of children in need.
            </p>

            <div className="flex gap-4">
              <a
                href="/donate"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Donate Now
              </a>
              <a
                href="/contact"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Contact Us
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
