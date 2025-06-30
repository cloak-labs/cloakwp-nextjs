import { jsx as _jsx } from "react/jsx-runtime";
import { SoftPageRefreshButton as BaseSoftPageRefreshButton } from "@cloakwp/react/components/SoftPageRefreshButton";
import { useSoftPageRefresh } from "../hooks/useSoftPageRefresh";
export const SoftPageRefreshButton = ({ pageData, ...props }) => {
    const { isRefreshing, refresh } = useSoftPageRefresh(pageData);
    return (_jsx(BaseSoftPageRefreshButton, { isRefreshing: isRefreshing, onClick: refresh, ...props }));
};
