import type { ComponentType } from "react";

/** Maps a tool slug to its lazily loaded workspace component (created with next/dynamic). */
export type ToolRendererMap = Record<string, ComponentType>;
