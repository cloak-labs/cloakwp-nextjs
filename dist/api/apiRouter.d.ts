import { type NextApiRequest, type NextApiResponse } from "next";
export declare const config: {
    api: {
        bodyParser: boolean;
    };
};
/**
 * Pages Router catch-all for `/pages/api/cloakwp/[[...route]].ts`.
 *
 * Preview cookies are pathname-scoped (`setPreviewData` / `clearPreviewData`
 * `path` option). Session cookies are set by the protocol handler. Revalidation
 * warms paths in the background after `res.revalidate`.
 */
export declare function apiRouter(req: NextApiRequest, res: NextApiResponse): Promise<void>;
//# sourceMappingURL=apiRouter.d.ts.map