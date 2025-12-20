interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <div className="size-full overflow-auto">
            <div className="max-w-7xl mx-auto p-8">
                {children}
            </div>
        </div>
    );
}
