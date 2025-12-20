import { Fragment } from "react";

export default function EditorLoading() {
    return (
        <Fragment>
            <div
                id="collapse-menu"
                className="@container shrink-0 overflow-hidden transition-all duration-500 ease-in-out peer-checked:w-62.5 xl:peer-checked:w-80 w-0 max-md:absolute max-md:inset-0 max-md:bg-linear-to-br max-md:from-guides-gradient-from max-md:to-guides-gradient-to max-md:z-50 max-md:py-4 max-md:rounded-r-2xl max-md:border max-md:border-zinc-700">
                <div className="w-62.5 xl:w-80 flex flex-col h-full relative z-100 px-4 md:pl-0 @sm:pl-0">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-6 h-6 bg-zinc-700 rounded animate-pulse mx-2" />
                            <div className="h-5 w-16 bg-zinc-700 rounded animate-pulse" />
                        </div>
                        <div className="w-6 h-6 bg-zinc-700 rounded animate-pulse block md:hidden" />
                    </div>

                    <div className="flex flex-col h-full pb-4 mt-4">
                        <div className="overflow-hidden flex-1">
                            <div className="overflow-y-auto overflow-x-hidden h-full pb-16">
                                <div className="flex space-x-px border-b border-zinc-700 mb-4">
                                    <div className="h-8 basis-1/2 rounded-t-sm bg-zinc-700 animate-pulse py-2 px-3" />
                                    <div className="h-8 basis-1/2 rounded-t-sm bg-zinc-800 animate-pulse py-2 px-3" />
                                </div>

                                <div className="space-y-4 px-1">
                                    <div className="space-y-2">
                                        <div className="h-4 w-1/3 rounded bg-zinc-600 animate-pulse" />
                                        <div className="h-8 w-full rounded-md bg-zinc-700 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 w-1/4 rounded bg-zinc-600 animate-pulse" />
                                        <div className="h-12 w-full rounded-md bg-zinc-700 animate-pulse" />
                                    </div>
                                    <div className="h-8 w-full rounded-md bg-zinc-700 animate-pulse" />
                                    <div className="h-8 w-5/6 rounded-md bg-zinc-700 animate-pulse" />
                                    <div className="h-8 w-full rounded-md bg-zinc-700 animate-pulse" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 max-md:px-4 pr-4 flex items-center gap-2">
                            <div className="h-9 w-full rounded-md bg-zinc-700 animate-pulse" />
                            <div className="h-9 w-9 rounded-md bg-zinc-700 animate-pulse shrink-0" />
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="content-container"
                className="overflow-x-hidden stack flex bg-content md:border md:border-zinc-900 md:rounded-2xl w-full relative z-20">
                <main className="contents">
                    <div className="size-full pt-4 pb-8">
                        <div className="flex absolute inset-0 p-4 justify-between items-center select-none h-fit gap-x-4">
                            <div className="w-6 h-6 rounded-md bg-zinc-700 animate-pulse" />
                            <div className="h-4 w-32 rounded-md bg-zinc-700 animate-pulse" />
                            <div className="flex items-center gap-x-6">
                                <div className="w-8 h-8 bg-zinc-700 rounded-md animate-pulse" />
                                <div className="w-6 h-6 rounded-full bg-zinc-700 animate-pulse" />
                            </div>
                        </div>

                        <div className="px-8 lg:px-0 pt-12 h-full transition w-full md:w-[95%] justify-self-center">
                            <div className="flex flex-col h-full">
                                <div className="absolute w-full -z-10 inset-0 shadow-2xl bg-linear-to-r from-[#401727] to-[#311e7696] opacity-20 rounded-full blur-3xl" />

                                <div className="size-full flex items-center justify-center flex-col gap-y-4">
                                    <div className="flex items-center justify-center mb-2">
                                        <div className="w-12 h-12 bg-zinc-700 rounded animate-pulse" />
                                    </div>
                                    <div className="h-8 w-64 bg-zinc-700 rounded animate-pulse" />
                                    <div className="space-y-2 text-center">
                                        <div className="h-4 w-80 bg-zinc-700 rounded animate-pulse mx-auto" />
                                        <div className="h-4 w-96 bg-zinc-700 rounded animate-pulse mx-auto" />
                                    </div>
                                    <div className="w-48 h-px bg-zinc-700 animate-pulse" />
                                    <div className="h-9 w-32 bg-zinc-700 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </Fragment>
    );
}
