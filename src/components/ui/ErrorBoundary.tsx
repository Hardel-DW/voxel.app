import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode | ((error: Error) => ReactNode);
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback && this.state.error && typeof this.props.fallback === "function") {
                return this.props.fallback(this.state.error);
            }
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
