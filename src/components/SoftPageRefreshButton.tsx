import { SoftPageRefreshButton as BaseSoftPageRefreshButton } from "@cloakwp/react/components/SoftPageRefreshButton";
import { useSoftPageRefresh } from "../hooks/useSoftPageRefresh";

export type SoftPageRefreshButtonProps = {
  pageData: Record<string, any>;
};

export const SoftPageRefreshButton: React.FC<SoftPageRefreshButtonProps> = ({
  pageData,
  ...props
}) => {
  const { isRefreshing, refresh } = useSoftPageRefresh(pageData);

  return (
    <BaseSoftPageRefreshButton
      isRefreshing={isRefreshing}
      onClick={refresh}
      {...props}
    />
  );
};
