import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Is Finora completely free to use?",
    a: "Yes! Finora is 100% free with full access to all tracking, income management, category analytics, budget goals, and CSV exports without hidden fees or paywalls."
  },
  {
    q: "How secure is my financial data?",
    a: "Your privacy is our top priority. All logins and sessions are protected with JWT (JSON Web Tokens) and passwords are encrypted using bcrypt hashing algorithms. We never sell or share your data."
  },
  {
    q: "Can I set monthly budgets and get alerts?",
    a: "Absolutely! You can define custom monthly budget caps for categories like Food, Entertainment, or Shopping. Our real-time progress bars notify you when you approach your spending limits."
  },
  {
    q: "Can I export my expense records for tax filing?",
    a: "Yes! With one click on the Analytics or Expenses page, you can download a full CSV export of your logged transactions anytime for personal backup or tax accounting."
  },
  {
    q: "Does Finora support multiple income streams?",
    a: "Yes, you can track salary, freelance payouts, stock dividends, rental income, and side hustles independently from your day-to-day expenses."
  }
];

export const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 sm:px-12 lg:px-24 bg-slate-950/80 border-t border-slate-900 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-400 text-base">
            Everything you need to know about tracking your money with Finora.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800/80 rounded-md overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-semibold text-slate-100 text-base sm:text-lg">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 bg-violet-600 text-white" : "text-slate-400"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-400 text-sm sm:text-base leading-relaxed border-t border-slate-800/40 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
