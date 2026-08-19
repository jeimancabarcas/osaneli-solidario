import React from 'react';

interface FooterProps {
  onOpenPolicy: () => void;
  onOpenReport: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicy,
  onOpenReport,
  onOpenContact,
}) => {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#1a221a] border-t border-[#46464d] py-8 px-4 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto"
    >
      <div className="font-anybody font-extrabold text-[24px] md:text-[28px] text-[#dce5d9] tracking-tight uppercase">
        OSANELI
      </div>

      <div className="font-mono-tag text-[12px] text-[#c6c6ce] text-center">
        © 2024 OSANELI - TODOS SOMOS COLOMBIA
      </div>

      <div className="flex flex-wrap justify-center gap-6 font-mono-tag text-[12px] text-[#c6c6ce]">
        <button
          onClick={onOpenPolicy}
          className="hover:text-[#e9c349] underline underline-offset-4 transition-all opacity-80 hover:opacity-100 cursor-pointer"
        >
          Solidarity Policy
        </button>
        <button
          onClick={onOpenReport}
          className="hover:text-[#e9c349] underline underline-offset-4 transition-all opacity-80 hover:opacity-100 cursor-pointer"
        >
          Impact Report
        </button>
        <button
          onClick={onOpenContact}
          className="hover:text-[#e9c349] underline underline-offset-4 transition-all opacity-80 hover:opacity-100 cursor-pointer"
        >
          Contact
        </button>
      </div>
    </footer>
  );
};
