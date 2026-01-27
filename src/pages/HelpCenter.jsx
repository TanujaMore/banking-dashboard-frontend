export default function HelpCenter() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow p-10 text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Still need help?</h1>
        <p className="text-gray-500 mb-10">
          Our support team is available to assist you
        </p>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <SupportCard
            icon="✉️"
            title="Email"
            value="support@financehub.com"
            onClick={() =>
              window.open("mailto:support@financehub.com")
            }
          />

          {/* Phone */}
          <SupportCard
            icon="📞"
            title="Phone"
            value="1-800-FINANCE"
            onClick={() =>
              window.open("tel:18003462623")
            }
          />

          {/* Hours */}
          <SupportCard
            icon="⏰"
            title="Hours"
            value="24/7 Support"
            onClick={() =>
              alert("Our support is available 24/7 including holidays.")
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- SUPPORT CARD ---------------- */

function SupportCard({ icon, title, value, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-50 rounded-xl p-8 flex flex-col items-center
                 cursor-pointer hover:shadow-lg hover:bg-gray-100
                 transition-all duration-200"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-gray-500">{value}</p>
    </div>
  );
}
