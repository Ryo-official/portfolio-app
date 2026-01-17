import React from "react";

const Contact: React.FC = () => {
  return (
    <section className="max-w-xl mx-auto px-4 py-20">
      <h2 className="text-4xl font-bold mb-6">Contact</h2>
      <form className="space-y-6">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          placeholder="Your Message"
          className="w-full border rounded-lg px-4 py-2 h-32"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </section>
  );
};

export default Contact;
