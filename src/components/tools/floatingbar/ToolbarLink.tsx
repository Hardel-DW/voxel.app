import { Link } from "@tanstack/react-router";

interface ToolbarLinkProps {
    icon: string;
    tooltip: string;
    onClick?: () => void;
    to: string;
    lang: string;
}

export function ToolbarLink({ icon, tooltip, onClick = () => {}, to, lang }: ToolbarLinkProps) {
    return (
        <Link
            to={to}
            params={{ lang: lang }}
            onClick={onClick}
            onMouseDown={(e) => e.stopPropagation()}
            title={tooltip}
            className="w-8 h-8 select-none user-select-none hover:bg-zinc-800/50 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center">
            <img src={icon} alt="" className="w-5 h-5 invert opacity-75 select-none user-select-none" />
        </Link>
    );
}
