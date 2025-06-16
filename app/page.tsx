import Image from "next/image";
import Schedule from "./schedule";
import Logo from '@/public/logo.svg'
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center flex-col p-8 gap-3 sm:px-12 lg:px-14 2xl:px-16 font-[family-name:var(--font-geist-sans)] max-w-full">
      <div className="flex flex-row items-center gap-3 md:gap-5 drop-shadow-md">
        <Image
          src={Logo}
          alt="AleczR Logo"
          className="h-12 md:h-24 w-auto"
        />
        <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
          <span className="text-sky-500">CICT</span> SchedMap
        </h1>
      </div>
      <p className="leading-7 max-w-2xl text-center">
        A web application that lets NEUST CICT Sumacab students view and access block schedules quickly and conveniently.
      </p>
      <Schedule />
      <p className="max-w-2xl text-center italic text-muted-foreground text-xs md:text-sm">
        For the blocks in the NEUST College of Information and Communications Technology - Sumacab Campus. Academic Year
        2025-2026, First Semester.
      </p>
      <p className="max-w-2xl text-center italic text-muted-foreground text-xs md:text-sm">
        If you have any questions, suggestions, or concerns, feel free to email me at{" "}
        <Link
          href="mailto:cict+schedmap@aleczr.link"
          className="text-sky-500 hover:underline underline-offset-2"
        >
          cict+schedmap@aleczr.link
        </Link>
      </p>
    </div >
  )
}
