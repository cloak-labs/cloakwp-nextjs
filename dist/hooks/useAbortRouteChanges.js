"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAbortRouteChanges = void 0;
const react_1 = require("react");
const router_1 = require("next/router");
function abortRouteChange(abortMsg) {
    throw new Error(abortMsg ?? "Aborting route change by throwing an Error.");
}
function useAbortRouteChanges(abortMsg) {
    const router = (0, router_1.useRouter)();
    const eventCallback = (event) => {
        console.log("eventCallback event: ", event);
        return abortRouteChange(abortMsg);
    };
    (0, react_1.useEffect)(() => {
        if (typeof window !== "undefined") {
            router.events.on("routeChangeStart", eventCallback);
            return () => {
                router.events.off("routeChangeStart", eventCallback);
            };
        }
    }, [router, abortRouteChange]);
}
exports.useAbortRouteChanges = useAbortRouteChanges;
