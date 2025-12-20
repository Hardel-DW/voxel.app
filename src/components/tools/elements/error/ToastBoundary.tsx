import { Component, type ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    error: Error | null;
}

export default class ToastBoundary extends Component<Props, State> {
    state = { error: null };

    static getDerivedStateFromError(error: unknown) {
        return { error: error instanceof Error ? error : new Error(error as string) };
    }

    componentDidCatch(error: unknown) {
        const actualError = error instanceof Error ? error : new Error(error as string);
        this.setState({ error: actualError });
    }

    render() {
        return this.props.children;
    }
}
