import { useGitHubAuth } from "@/lib/hook/useGitHubAuth";

export default function AuthView() {
    const { user, logout } = useGitHubAuth();
    if (!user) return null;

    return (
        <div className="flex items-center gap-4">
            <img src={user?.avatar_url} alt={user?.login} className="w-10 h-10 rounded-full border-2 border-zinc-500" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-200 truncate">{user?.login}</p>
                <p className="text-xs text-zinc-400 truncate">ID: {user?.id}</p>
            </div>
            <button type="button" onClick={() => logout()} className="cursor-pointer text-zinc-400 hover:text-zinc-200 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
            </button>
        </div>
    );
}
