import { useState } from "react";
import { cn } from "@/lib/utils";
import type { PaginatedResult } from "@/lib/utils/instance";

export interface PageState<T> extends PaginatedResult<T> {
    page: number;
    loading: boolean;
}

const emptyPage = <T,>(): PageState<T> => ({ items: [], total: 0, hasMore: false, page: 0, loading: false });

export const usePaginatedLoader = <T, C = undefined>(loader: (page: number, context: C) => Promise<PaginatedResult<T>>) => {
    const [state, setState] = useState<PageState<T>>(emptyPage());

    const load = async (page = 0, context?: C) => {
        setState((s) => ({ ...s, loading: true }));
        const result = await loader(page, context as C);
        setState({ ...result, page, loading: false });
    };

    return { ...state, load, reset: () => setState(emptyPage()) };
};

interface PaginationProps {
    page: number;
    total: number;
    pageSize: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, total, pageSize, loading, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={`page-${i.toString()}`}
                    type="button"
                    onClick={() => onPageChange(i)}
                    disabled={loading}
                    className={cn(
                        "size-8 text-sm rounded-lg transition-all disabled:opacity-50",
                        page === i ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    )}>
                    {i + 1}
                </button>
            ))}
        </div>
    );
}
