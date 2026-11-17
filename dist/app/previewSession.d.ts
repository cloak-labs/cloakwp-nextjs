import { type PreviewModeParams } from "cloakwp/preview";
export declare const previewCookieName = "__cloakwp_preview";
export type CloakWpPreview = {
    pathname: string;
    data: PreviewModeParams;
};
export declare function sealPreviewSession(preview: CloakWpPreview, secret: string, maxAge: number, now?: number): string;
export declare function openPreviewSession(value: string | undefined, secret: string, now?: number): CloakWpPreview | undefined;
//# sourceMappingURL=previewSession.d.ts.map