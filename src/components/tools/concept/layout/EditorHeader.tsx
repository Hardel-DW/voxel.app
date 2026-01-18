import { Identifier, type IdentifierObject } from "@voxelio/breeze";
import type { ReactNode } from "react";
import { EditorBreadcrumb } from "@/components/tools/concept/layout/EditorBreadcrumb";
import { EditorHeaderTabs } from "@/components/tools/concept/layout/EditorHeaderTabs";
import { useActiveConcept } from "@/lib/hook/useActiveConcept";
import { useTranslate } from "@/lib/i18n";
import { hueToHsl, stringToColor } from "@/lib/utils/color";

interface EditorHeaderProps {
    fallbackTitle: string;
    identifier?: IdentifierObject;
    filterPath?: string;
    isOverview: boolean;
    onBack?: () => void;
    children?: ReactNode;
}

export function EditorHeader({ fallbackTitle, identifier, filterPath, isOverview, onBack, children }: EditorHeaderProps) {
    const t = useTranslate();
    const { tabs, activeTab, lang, showTabs } = useActiveConcept();
    const title = isOverview
        ? filterPath
            ? Identifier.toDisplay(filterPath.split("/").pop() || "")
            : t("editor.all")
        : identifier
          ? new Identifier(identifier).toResourceName()
          : fallbackTitle;

    const colorKey = isOverview ? filterPath || "all" : identifier ? new Identifier(identifier).toUniqueKey() : fallbackTitle;
    const bgColor = hueToHsl(stringToColor(colorKey));

    return (
        <header className="relative shrink-0 overflow-hidden border-b border-zinc-800/50 bg-zinc-900/50">
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 mix-blend-overlay opacity-40 transition-colors duration-500"
                    style={{ backgroundColor: bgColor }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[20px_20px]" />
            </div>

            <div className="relative z-10 flex flex-col justify-end p-8 pb-6">
                <div className="flex items-end justify-between gap-8 relative z-20">
                    <div className="space-y-2">
                        <EditorBreadcrumb
                            rootLabel={fallbackTitle}
                            identifier={identifier}
                            filterPath={filterPath}
                            isOverview={isOverview}
                            onBack={onBack}
                        />
                        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-xl font-minecraft">{title}</h1>
                        <div
                            className="h-px w-24 mt-3 transition-colors duration-500"
                            style={{ background: `linear-gradient(90deg, ${bgColor}, transparent)` }}
                        />
                    </div>

                    {isOverview && <div className="flex items-center gap-3">{children}</div>}
                </div>

                {showTabs && (
                    <nav className="flex items-center gap-1 mt-6 -mb-2">
                        {tabs.map((tab) => (
                            <EditorHeaderTabs key={tab.id} tab={tab} lang={lang} isActive={activeTab?.id === tab.id} />
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
