import { NextConfig } from "next";
/**
 * A function to merge CloakWP-related Next.js config with a user defined Next.js config
 *
 * @param {NextConfig} userNextConfig The user's Next.js config
 */
export declare function withCloakWP(userNextConfig?: NextConfig): NextConfig;
