export default function PageLoading() {
    return (
        <div className="flex relative md:p-4 h-dvh">
            <div className="fixed -z-50 -top-16 -right-16 size-72 rounded-full blur-3xl bg-linear-to-br from-red-900/20 to-blue-900/20" />
            <div className="fixed -z-50 top-0 bottom-0 translate-y-1/2 -left-8 w-64 h-full rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />
            <div className="fixed -z-50 -bottom-24 -right-24 size-60 rounded-full blur-3xl bg-linear-to-br from-purple-900/20 to-red-900/20" />
            <div className="fixed -z-50 -top-16 -left-16 size-100 rounded-full blur-3xl bg-linear-to-br from-pink-900/20 to-blue-900/20" />

            <main className="w-full">
                <nav className="sticky top-0 z-40 backdrop-blur-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div className="h-8 w-24 rounded bg-zinc-700 animate-pulse" />
                            </div>
                            <div className="hidden md:flex space-x-4">
                                <div className="h-5 w-16 rounded bg-zinc-700 animate-pulse" />
                                <div className="h-5 w-16 rounded bg-zinc-700 animate-pulse" />
                                <div className="h-5 w-16 rounded bg-zinc-700 animate-pulse" />
                            </div>
                            <div className="h-8 w-8 rounded-full bg-zinc-700 animate-pulse md:hidden" />
                        </div>
                    </div>
                </nav>

                <section className="w-11/12 md:w-3/4 mx-auto flex flex-col justify-evenly xl:grid grid-cols-2 items-center relative gap-8 min-h-[calc(100vh-4rem)]">
                    <div className="h-full w-[95%] md:w-full relative py-10">
                        <div className="xl:invisible visible absolute flex justify-center items-center size-full -z-10">
                            <div className="absolute inset-0 top-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-pink-900/30 opacity-50 rounded-full blur-[5rem]" />
                        </div>
                        <div className="size-full flex flex-col justify-center">
                            <div className="h-4 w-1/4 rounded bg-pink-700/50 animate-pulse mb-2" />
                            <div className="h-10 w-3/4 rounded bg-zinc-700 animate-pulse mb-4" />
                            <div className="h-8 w-full rounded bg-zinc-700 animate-pulse mb-1" />
                            <div className="h-8 w-5/6 rounded bg-zinc-700 animate-pulse mb-1" />
                            <div className="h-8 w-2/3 rounded bg-zinc-700 animate-pulse mb-6" />

                            <div className="flex items-center flex-col sm:flex-row gap-4 mt-8">
                                <div className="h-10 w-40 rounded-md bg-zinc-700 animate-pulse" />
                                <div className="h-10 w-48 rounded-md bg-zinc-700 animate-pulse" />
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full flex justify-center items-center h-64 md:h-80">
                        <div className="w-full h-full max-w-md rounded-lg bg-zinc-800 animate-pulse flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-4 border-zinc-600 border-t-transparent animate-spin" />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
