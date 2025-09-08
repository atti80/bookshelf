import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="min-h-16 flex items-center justify-between p-4 bg-background">
      <div className="flex flex-col">
        <span>Békés Nikolett</span>
        <span>konyvelvono@gmail.com</span>
      </div>
      <div className="max-xs:hidden w-16 flex items-center transition-all duration-500">
        <Image
          src="/images/redhead_round.png"
          alt="logo"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-auto"
        ></Image>
      </div>
      <div className="flex gap-2 text-background">
        <Link href="https://www.facebook.com/konyvelvonohungary">
          <div className="bg-primary-dark rounded-sm p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
              />
            </svg>
          </div>
        </Link>
        <Link href="https://www.instagram.com/konyvelvono/">
          <div className="bg-primary-dark rounded-sm p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37m1.5-4.87h.01" />
              </g>
            </svg>
          </div>
        </Link>
        <Link href="https://www.youtube.com/channel/UCZNlfUQLLu7f1yE46tajs2A">
          <div className="bg-primary-dark rounded-sm p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
              >
                <path d="M2.5 17a24.1 24.1 0 0 1 0-10a2 2 0 0 1 1.4-1.4a49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10a2 2 0 0 1-1.4 1.4a49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <path d="m10 15l5-3l-5-3z" />
              </g>
            </svg>
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
