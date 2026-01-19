import EmptyState from "@/components/home/sections/EmptyState";
import ProjectList from "@/components/home/sections/ProjectList";
import { useHomeStore } from "@/lib/store/HomeStore";

export default function RecentProjects() {
    const projects = useHomeStore((s) => s.recentProjects);

    return <section className="space-y-4 relative z-50 px-8">{projects.length > 0 ? <ProjectList /> : <EmptyState />}</section>;
}
