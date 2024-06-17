import Link from "next/link"
import Logo from "@/components/logo"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function DocumentationPage() {
  return (
    <div className="flex h-full w-screen flex-col overscroll-none">
      <header className="sticky top-0 z-50 flex w-full items-center border-b bg-white px-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <Link className="flex items-center gap-4" href="#">
          <Logo width={25} height={25} />
          <span className="text-lg font-semibold">Onlook Docs</span>
        </Link>
        <nav className="h-12 ml-auto flex items-center gap-4">
          <ModeToggle />
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Docs
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Blog
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Community
          </Link>
          <div className="relative">
            <Input
              className="h-8 w-48 rounded-md border border-gray-200 bg-gray-100 px-3 text-sm focus:border-gray-300 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
              placeholder="Search docs..."
              type="search"
            />
            <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        </nav>
      </header>
      <div className="flex flex-1">
        <div className="hidden w-64 border-r bg-gray-100 p-6 dark:border-gray-800 dark:bg-gray-900 lg:block">
          <div className="sticky top-16 space-y-6">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Getting Started</h4>
              <ul className="text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Installation
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Configuration
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Core Concepts</h4>
              <ul className="text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Components
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Routing
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Data Fetching
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Advanced Topics</h4>
              <ul className="text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Deployment
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Performance
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Testing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Introduction to Acme Docs</h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Welcome to the Acme Docs, your comprehensive guide to building modern web applications with our powerful
                framework.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                To get started with Acme Docs, follow these simple steps:
              </p>
              <ol className="mt-4 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">1. Install the framework</span>-
                  Download the latest version of Acme Docs and install it using npm or yarn.
                </li>
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">2. Create a new project</span>- Use the
                  Acme Docs CLI to quickly scaffold a new project with all the necessary files and configurations.
                </li>
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">3. Explore the documentation</span>-
                  Browse through the comprehensive documentation to learn about the various features and capabilities of
                  Acme Docs.
                </li>
              </ol>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Core Concepts</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Acme Docs is built on a set of core concepts that you should understand to effectively use the
                framework:
              </p>
              <ul className="mt-4 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">Components</span>- Acme Docs uses a
                  component-based architecture, allowing you to build reusable UI elements.
                </li>
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">Routing</span>- The framework provides a
                  powerful routing system to navigate between different pages of your application.
                </li>
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">Data Fetching</span>- Acme Docs
                  simplifies the process of fetching data from various sources, such as APIs or databases.
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Advanced Topics</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                As you become more proficient with Acme Docs, you can explore these advanced topics to take your
                applications to the next level:
              </p>
              <ul className="mt-4 space-y-2 text-gray-500 dark:text-gray-400">
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">Deployment</span>- Learn how to
                  efficiently deploy your Acme Docs applications to various hosting platforms.
                </li>
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">Performance</span>- Discover techniques
                  to optimize the performance of your Acme Docs applications.
                </li>
                <li>
                  <span className="font-medium text-gray-900 dark:text-gray-50">Testing</span>- Explore the testing
                  framework provided by Acme Docs to ensure the quality of your applications.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hidden w-64 border-l bg-gray-100 p-6 dark:border-gray-800 dark:bg-gray-900 lg:block">
          <div className="sticky top-16 space-y-6">
            <div>
              <h4 className="text-sm font-medium">Quick Links</h4>
              <ul className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Getting Started
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Core Concepts
                  </Link>
                </li>
                <li>
                  <Link className="block py-1 hover:text-gray-900 dark:hover:text-gray-50" href="#">
                    Advanced Topics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium">Search</h4>
              <div className="relative mt-2">
                <Input
                  className="h-8 w-full rounded-md border border-gray-200 bg-gray-100 px-3 text-sm focus:border-gray-300 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
                  placeholder="Search docs..."
                  type="search"
                />
                <Search className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

