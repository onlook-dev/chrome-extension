<script lang="ts">
    let tourVisible = true;
</script>

<div
    class="{tourVisible ? 'visible' : 'invisible'} 
        fixed inset-0 z-50 flex items-center justify-center bg-black/40"
>
    <div
        class="border bg-black rounded-lg shadow-lg w-full max-w-3xl p-8 md:p-12"
    >
        <div class="grid gap-6">
            <div class="text-center">
                <h2 class="text-2xl font-bold">Welcome to Onlook</h2>
                <p class="">Let's take a quick tour to get you started.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="flex items-start gap-4">
                    <div class="bg-primary/10 rounded-full p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="w-6 h-6 text-primary"
                        >
                            <path
                                d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"
                            ></path>
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold">Explore the Dashboard</h3>
                        <p class="">
                            Get an overview of your business metrics and key
                            insights.
                        </p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div
                        class="bg-primary/10 dark:bg-primary/20 rounded-full p-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="w-6 h-6 text-primary"
                        >
                            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
                            ></path>
                            <rect width="20" height="14" x="2" y="6" rx="2"
                            ></rect>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold">Manage Your Projects</h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            Create, edit, and track the progress of your
                            projects.
                        </p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div
                        class="bg-primary/10 dark:bg-primary/20 rounded-full p-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="w-6 h-6 text-primary"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                            ></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold">
                            Collaborate with Your Team
                        </h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            Invite team members, assign tasks, and communicate
                            effectivel
                        </p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div
                        class="bg-primary/10 dark:bg-primary/20 rounded-full p-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="w-6 h-6 text-primary"
                        >
                            <path d="M8 2v4"></path>
                            <path d="M16 2v4"></path>
                            <rect width="18" height="18" x="3" y="4" rx="2"
                            ></rect>
                            <path d="M3 10h18"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold">Stay on Top of Deadlines</h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            View your team's schedule and set reminders for
                            important dates.
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex justify-end">
                <button
                    class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    on:click={() => (tourVisible = false)}
                >
                    Got it, let's get started!
                </button>
            </div>
        </div>
    </div>
</div>
