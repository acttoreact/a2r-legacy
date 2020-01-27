/* eslint-disable @typescript-eslint/no-explicit-any */
import { BasicContext } from "../../model/data";

export const pathCache = new Map<string, string>();
export const moduleCache = new Map<string, (a2rContext: BasicContext) => any>();
