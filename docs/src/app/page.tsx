import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Logo from "@/components/logo"

export default function Home() {
  return (
    <main className="flex flex-col h-screen items-center justify-center">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <Logo />
        <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl">
          {siteConfig.name}
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          {siteConfig.description}
        </p>
        <div className="flex gap-2">
          <Link
            href={siteConfig.links.quickstart}
            className={cn(buttonVariants({ size: "default" }))}
          >
            Get Started
          </Link>
          <ModeToggle />
        </div>
      </div>
      <div className="w-full max-w-md flex flex-col gap-3">
        <p className="m-0 p-0 text-left text-lg">What is Onlook?</p>
        <p className="m-0 p-0 text-left text-gray-600">Onlook is a browser extension that lets anyone edit any webpage, then publish their edits to a codebase without writing any code themselves. Designers can build directly on the website itself, and Developers can focus on building more than User Interfaces.</p>
      </div>
      <div className="w-full h-px bg-[rgb(51, 51, 51) max-w-[600px]"></div>
    </main>
  )
}
