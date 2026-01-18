import { createFileRoute, useParams } from "@tanstack/react-router";
import type { EnchantmentOption, EnchantmentStats, SlotLevelRange, TagType } from "@voxelio/breeze";
import { type Enchantment, EnchantmentSimulator, Identifier, TagsProcessor, toRoman } from "@voxelio/breeze";
import type { Component } from "react";
import { useRef, useState } from "react";
import EnchantingTable from "@/components/tools/elements/EnchantingTable";
import MinecraftSlot from "@/components/tools/elements/gui/MinecraftSlot";
import MinecraftTooltip from "@/components/tools/elements/gui/MinecraftTooltip";
import SimpleCard from "@/components/tools/elements/SimpleCard";
import { Toolbar } from "@/components/tools/floatingbar/Toolbar";
import { ToolbarTextButton } from "@/components/tools/floatingbar/ToolbarTextButton";
import { ToolbarTextLink } from "@/components/tools/floatingbar/ToolbarTextLink";
import { Button } from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import {
    Dialog,
    DialogCloseButton,
    DialogContent,
    DialogFooter,
    type DialogHandle,
    DialogHeader,
    DialogHero
} from "@/components/ui/Dialog";
import { MultiStep, MultiStepControl, MultiStepItem } from "@/components/ui/MultiStep";
import { Switch } from "@/components/ui/Switch";
import useRegistry, { type FetchedRegistry } from "@/lib/hook/useRegistry";
import { useTranslate } from "@/lib/i18n";
import { mergeRegistries } from "@/lib/registry";
import { useConfiguratorStore } from "@/lib/store/StudioStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$lang/studio/editor/enchantment/simulation")({
    component: RouteComponent
});

function RouteComponent() {
    const t = useTranslate();
    const defaultCount = 15;
    const dialogRef = useRef<DialogHandle>(null);
    const params = useParams({ from: "/$lang/studio/editor" });
    const [blockCount, setBlockCount] = useState(defaultCount);
    const [itemInput, setItemInput] = useState("minecraft:diamond_sword");
    const [enchantability, setEnchantability] = useState(10);
    const [includeVanilla, setIncludeVanilla] = useState(false);
    const [stats, setStats] = useState<EnchantmentStats[]>([]);
    const [output, setOutput] = useState<EnchantmentOption>();
    const [showTooltip, setShowTooltip] = useState(false);
    const [slotRanges, setSlotRanges] = useState<SlotLevelRange[]>(new EnchantmentSimulator(new Map()).getSlotLevelRanges(defaultCount));
    const { data: vanillaEnchantment } = useRegistry<FetchedRegistry<Enchantment>>("summary", "enchantment");
    const { data: vanillaTagsItem } = useRegistry<FetchedRegistry<TagType>>("summary", "tag/item");
    const { data: vanillaTagsEnchantment } = useRegistry<FetchedRegistry<TagType>>("summary", "tag/enchantment");
    const { data: components } = useRegistry<FetchedRegistry<Component>>("component");
    const enchantmentsTooltipEntries = output?.enchantments.map((enchantment) => ({
        enchantment: Identifier.of(enchantment.enchantment, "enchantment"),
        level: enchantment.level
    }));

    const runSimulation = (index: number) => {
        const getRegistry = useConfiguratorStore.getState().getRegistry;
        const enchantments = getRegistry("enchantment");
        const itemTagsRegistry = getRegistry<TagType>("tags/item");
        const enchantmentTagsRegistry = getRegistry<TagType>("tags/enchantment");

        const allEnchantments = mergeRegistries(includeVanilla ? vanillaEnchantment : {}, enchantments, "enchantment");
        const allItemTags = mergeRegistries(vanillaTagsItem, itemTagsRegistry, "tags/item");
        const allVanillaTagsEnchantments = mergeRegistries(vanillaTagsEnchantment, [], "tags/enchantment");

        const enchantmentMap = new Map(allEnchantments.map((element) => [new Identifier(element.identifier).toString(), element.data]));
        const compiledEnchTags = TagsProcessor.merge([
            { id: "vanilla", tags: allVanillaTagsEnchantments },
            { id: "datapack", tags: enchantmentTagsRegistry }
        ]);

        const flatten = new TagsProcessor(compiledEnchTags).flatten();
        const simulator = new EnchantmentSimulator(enchantmentMap as Map<string, Enchantment>, flatten);
        const itemTags = new TagsProcessor(allItemTags).findItemTags(itemInput).map((tag) => tag.toString());
        setOutput(simulator.simulateEnchantmentTable(blockCount, enchantability, itemTags)[index]);
        setStats(simulator.calculateEnchantmentProbabilities(blockCount, enchantability, itemTags, 5000, index));
    };

    const getAvailableItems = () => {
        const getRegistry = useConfiguratorStore.getState().getRegistry;
        const enchantments = getRegistry<Enchantment>("enchantment");
        const itemTagsRegistry = getRegistry<TagType>("tags/item");
        const allEnchantments = mergeRegistries(vanillaEnchantment, enchantments, "enchantment");
        const allItemTags = mergeRegistries(vanillaTagsItem, itemTagsRegistry, "tags/item");
        const enchantmentMap = new Map(allEnchantments.map((element) => [new Identifier(element.identifier).toString(), element.data]));
        const simulator = new EnchantmentSimulator(enchantmentMap);
        return simulator.getFlattenedPrimaryItems(allItemTags);
    };

    const calculateSlotRanges = (count: number) => {
        setSlotRanges(new EnchantmentSimulator(new Map()).getSlotLevelRanges(count));
        setBlockCount(count);
    };

    const setItemInputHandler = (item: string) => {
        setItemInput(item);

        const identifier = Identifier.of(item, "item");
        const component = components?.[identifier.resource] as { "minecraft:enchantable"?: { value?: number } };
        const enchantability = component?.["minecraft:enchantable"]?.value;
        if (typeof enchantability !== "number") return;

        setEnchantability(enchantability);
    };

    return (
        <div className="flex flex-col size-full overflow-hidden">
            <Dialog id="enchantment-simulation-welcome">
                <DialogContent ref={dialogRef} reminder defaultOpen className="sm:max-w-[800px]">
                    <MultiStep>
                        <MultiStepItem>
                            <DialogHeader>
                                <DialogHero image="/images/background/dialog/enchantment/simulation_1.webp" />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    {t("enchantment:simulation.dialog.usage.title")}
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>{t("enchantment:simulation.dialog.usage.body")}</p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        <li>{t("enchantment:simulation.dialog.usage.list.1")}</li>
                                        <li>{t("enchantment:simulation.dialog.usage.list.2")}</li>
                                        <li>{t("enchantment:simulation.dialog.usage.list.3")}</li>
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>
                        <MultiStepItem>
                            <DialogHeader>
                                <DialogHero image="/images/background/dialog/enchantment/simulation_2.webp" />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    {t("enchantment:simulation.dialog.stats.title")}
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>{t("enchantment:simulation.dialog.stats.body")}</p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        <li>{t("enchantment:simulation.dialog.stats.list.1")}</li>
                                        <li>{t("enchantment:simulation.dialog.stats.list.2")}</li>
                                        <li>{t("enchantment:simulation.dialog.stats.list.3")}</li>
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>
                        <MultiStepItem>
                            <DialogHeader>
                                <DialogHero image="/images/background/dialog/enchantment/simulation_3.webp" />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    {t("enchantment:simulation.dialog.results.title")}
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>{t("enchantment:simulation.dialog.results.body")}</p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        <li>{t("enchantment:simulation.dialog.results.list.1")}</li>
                                        <li>{t("enchantment:simulation.dialog.results.list.2")}</li>
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>
                        <MultiStepItem>
                            <DialogHeader>
                                <DialogHero image="/images/background/dialog/enchantment/simulation_4.webp" />
                            </DialogHeader>
                            <hr className="my-1" />
                            <div className="p-4">
                                <h2 className="flex shrink-0 items-center justify-between text-xl font-medium text-zinc-200 mb-2">
                                    {t("enchantment:simulation.dialog.item_selection.title")}
                                </h2>
                                <div className="relative leading-normal text-zinc-400 font-light">
                                    <p>{t("enchantment:simulation.dialog.item_selection.body")}</p>
                                    <ul className="list-disc list-inside ml-4 mt-4 text-zinc-500 text-sm">
                                        <li>{t("enchantment:simulation.dialog.item_selection.list.1")}</li>
                                        <li>{t("enchantment:simulation.dialog.item_selection.list.2")}</li>
                                        <li>{t("enchantment:simulation.dialog.item_selection.list.3")}</li>
                                    </ul>
                                </div>
                            </div>
                        </MultiStepItem>

                        <DialogFooter className="flex items-end justify-between">
                            <DialogCloseButton variant="ghost_border">{t("close")}</DialogCloseButton>
                            <MultiStepControl />
                        </DialogFooter>
                    </MultiStep>
                </DialogContent>
            </Dialog>
            <Toolbar>
                <div className="flex items-center gap-1">
                    <ToolbarTextLink
                        icon="/icons/tools/overview/home.svg"
                        tooltip="enchantment:simulation.toolbar.back"
                        labelText="enchantment:simulation.toolbar.back"
                        lang={params.lang}
                        to="/$lang/studio/editor/enchantment/overview"
                    />
                    <ToolbarTextButton
                        icon="/icons/tools/overview/help.svg"
                        tooltip="enchantment:simulation.toolbar.help"
                        onClick={() => dialogRef.current?.open()}
                        labelText="enchantment:simulation.toolbar.help"
                    />
                </div>
                <Button onClick={() => runSimulation(0)} className="rounded-full">
                    {t("enchantment:simulation.toolbar.run")}
                </Button>
            </Toolbar>

            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="relative mb-6">
                    <h1 className="text-2xl font-semibold">{t("enchantment:simulation.title")}</h1>
                    <p className="text-zinc-400 text-sm">{t("enchantment:simulation.description")}</p>
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
                    <SimpleCard className="flex justify-between px-2">
                        <div className="relative flex flex-col gap-6 w-full px-6">
                            <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-100">{t("enchantment:simulation.enchant_label")}</h3>
                                    <p className="text-xs text-zinc-500">{t("enchantment:simulation.enchant_sublabel")}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-6 w-full px-6">
                                <div className="flex flex-col items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTooltip(!showTooltip)}
                                        className="relative group cursor-pointer transition-transform hover:scale-105">
                                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img
                                            src={
                                                showTooltip
                                                    ? "/images/features/gui/book_open.webp"
                                                    : "/images/features/gui/book_closed.webp"
                                            }
                                            alt="Enchanting Book"
                                            className="pixelated w-20 relative"
                                        />
                                    </button>
                                    <div className="relative group">
                                        <MinecraftSlot
                                            id={itemInput}
                                            count={1}
                                            onItemChange={setItemInputHandler}
                                            items={getAvailableItems}
                                        />
                                        <MinecraftTooltip
                                            enchantments={enchantmentsTooltipEntries}
                                            name={Identifier.of(itemInput, "item")}
                                            className={cn("hidden group-hover:block absolute top-14 left-4 z-10", showTooltip && "block")}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    {[0, 1, 2].map((index) => (
                                        <button
                                            type="button"
                                            key={`slot-${index}`}
                                            onClick={() => runSimulation(index)}
                                            className="group relative flex items-center justify-between px-4 py-3 rounded-lg border transition-all cursor-pointer bg-zinc-900/50 border-zinc-800 hover:bg-purple-950/30 hover:border-purple-800/50">
                                            <div className="flex items-center gap-3">
                                                <span className="text-zinc-300 text-sm font-medium">
                                                    {t(`enchantment:simulation.slot.${index + 1}`)}
                                                </span>
                                            </div>
                                            {slotRanges[index] && (
                                                <span className="text-experience font-seven text-sm">
                                                    {slotRanges[index].minLevel} - {slotRanges[index].maxLevel}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </SimpleCard>
                    <SimpleCard className="flex justify-between px-2">
                        <div className="flex flex-col items-center gap-4 px-6">
                            <div className="size-50">
                                <EnchantingTable blockCount={blockCount} />
                            </div>
                            <Counter max={15} min={0} step={1} value={blockCount} onChange={calculateSlotRanges} />
                        </div>
                        <div className="flex flex-col justify-between items-center gap-4 border-l-2 border-zinc-900 px-6 flex-1">
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col w-3/4">
                                    <span className="text-lg font-medium text-zinc-200 tracking-wide">
                                        {t("enchantment:simulation.enchantability.title")}
                                    </span>
                                    <span className="text-sm text-zinc-500">{t("enchantment:simulation.enchantability.description")}</span>
                                </div>
                                <Counter max={15} min={0} step={1} value={enchantability} onChange={setEnchantability} />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col w-3/4">
                                    <span className="text-lg font-medium text-zinc-200 tracking-wide">
                                        {t("enchantment:simulation.vanilla.title")}
                                    </span>
                                    <span className="text-sm text-zinc-500">{t("enchantment:simulation.vanilla.description")}</span>
                                </div>
                                <label htmlFor="include-vanilla" className="cursor-pointer flex">
                                    <Switch id="include-vanilla" isChecked={includeVanilla} setIsChecked={setIncludeVanilla} />
                                </label>
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col w-3/4">
                                    <span className="text-lg font-medium text-zinc-200 tracking-wide">
                                        {t("enchantment:simulation.tooltip.title")}
                                    </span>
                                    <span className="text-sm text-zinc-500">{t("enchantment:simulation.tooltip.description")}</span>
                                </div>
                                <label htmlFor="tooltip" className="cursor-pointer flex">
                                    <Switch id="tooltip" isChecked={showTooltip} setIsChecked={setShowTooltip} />
                                </label>
                            </div>
                        </div>
                    </SimpleCard>
                </div>

                <div className="mt-12 mb-20">
                    <div className="relative mb-8">
                        <h2 className="text-2xl font-semibold mb-1">{t("enchantment:simulation.results.title")}</h2>
                        <ul className="text-zinc-400 text-sm list-disc list-inside space-y-1">
                            <li>{t("enchantment:simulation.results.description.1")}</li>
                            <li>{t("enchantment:simulation.results.description.2")}</li>
                        </ul>
                        <hr className="absolute -bottom-2 left-0 right-0" />
                    </div>
                    <div className="backdrop-blur-2xl border border-zinc-900 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-black/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            {t("enchantment:simulation.results.table.enchantment")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            {t("enchantment:simulation.results.table.probability")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            {t("enchantment:simulation.results.table.average_level")}
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-200">
                                            {t("enchantment:simulation.results.table.level_range")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {stats.length === 0 ? (
                                        <tr className="bg-black/30">
                                            <td colSpan={4} className="px-6 py-16">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="size-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-5 border border-zinc-800">
                                                        <img
                                                            src="/images/features/item/enchanted_book.webp"
                                                            className="size-10 pixelated opacity-40"
                                                            alt="No results"
                                                        />
                                                    </div>
                                                    <h3 className="text-lg font-medium text-zinc-300 mb-1">
                                                        {t("enchantment:simulation.results.empty.title")}
                                                    </h3>
                                                    <p className="text-zinc-500 text-sm max-w-sm text-center">
                                                        {t("enchantment:simulation.results.empty.description")}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.map((stat) => (
                                            <tr
                                                key={stat.enchantmentId}
                                                className="hover:bg-zinc-900/50 transition-colors odd:bg-black/30 even:bg-black/50">
                                                <td className="px-6 py-4 text-white font-medium">
                                                    {Identifier.of(stat.enchantmentId, "enchantment").toResourceName()}
                                                </td>
                                                <td className="px-6 py-4 text-zinc-300">{stat.probability.toFixed(2)}%</td>
                                                <td className="px-6 py-4 text-zinc-300">{stat.averageLevel.toFixed(1)}</td>
                                                <td className="px-6 py-4 text-zinc-300">
                                                    {stat.minLevel === stat.maxLevel ? (
                                                        <span className="font-medium text-zinc-300">{toRoman(stat.minLevel)}</span>
                                                    ) : (
                                                        <>
                                                            <span className="font-medium text-zinc-300">{toRoman(stat.minLevel)}</span>
                                                            <span className="font-light text-sm text-zinc-400 px-1.5">
                                                                {t("enchantment:simulation.results.level_range.to")}
                                                            </span>
                                                            <span className="font-medium text-zinc-300">{toRoman(stat.maxLevel)}</span>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
