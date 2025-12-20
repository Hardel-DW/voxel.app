import { create } from "zustand";

const INTERVAL_MS = 1500;
export const useAnimationStore = create<{ tick: number }>(() => ({ tick: 0 }));
setInterval(() => useAnimationStore.setState((state) => ({ tick: state.tick + 1 })), INTERVAL_MS);
