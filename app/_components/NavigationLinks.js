"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function NavigationLinks({ session }) {
  const pathname = usePathname().split("/")[1];
  const [activeLink, setActiveLink] = useState();

  return (
    <>
      <li>
        <Link
          href="/cabins"
          className={`hover:text-accent-400 transition-colors ${
            pathname === "cabins" ? "text-accent-400" : ""
          }`}
          onClick={() => setActiveLink("cabins")}
        >
          Cabins
        </Link>
      </li>
      <li>
        <Link
          href="/about"
          className={`hover:text-accent-400 transition-colors ${
            pathname === "about" ? "text-accent-400" : ""
          }`}
          onClick={() => setActiveLink("about")}
        >
          About
        </Link>
      </li>
      <li>
        {session?.user?.image ? (
          <Link
            href="/account"
            className={`hover:text-accent-400 transition-colors flex items-center gap-4 ${
              pathname === "account" ? "text-accent-400" : ""
            }`}
            onClick={() => setActiveLink("account")}
          >
            <img
              className="h-8 rounded-full"
              src={session.user.image}
              alt={session.user.name}
              referrerPolicy="no-referrer"
            />
            <span>Guest area</span>
          </Link>
        ) : (
          <Link
            href="/account"
            className={`hover:text-accent-400 transition-colors ${
              pathname === "account" ? "text-accent-400" : ""
            }`}
            onClick={() => setActiveLink("account")}
          >
            Guest area
          </Link>
        )}
      </li>
    </>
  );
}

export default NavigationLinks;
