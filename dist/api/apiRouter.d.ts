import { NextApiRequest, NextApiResponse } from "next";
export declare function withSecretValidation(req: NextApiRequest, res: NextApiResponse, callback: (req: NextApiRequest, res: NextApiResponse) => any): any;
export declare function apiRouter(req: NextApiRequest, res: NextApiResponse): Promise<void>;
