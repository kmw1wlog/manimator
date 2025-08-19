import { z } from 'zod';

export const ArtifactType = z.enum(['ocr', 'storyboard', 'manim_py', 'video']);

export const ArtifactSchema = z.object({
  type: ArtifactType,
  url: z.string().url().optional(),
  content: z.unknown().optional(),
});
export type Artifact = z.infer<typeof ArtifactSchema>;

export const RunStatusEnum = z.enum(['idle', 'running', 'success', 'error']);
export type RunStatus = z.infer<typeof RunStatusEnum>;

export const NodeRunSchema = z.object({
  status: RunStatusEnum,
  startedAt: z.date().optional(),
  finishedAt: z.date().optional(),
});
export type NodeRun = z.infer<typeof NodeRunSchema>;

export const NodeType = ArtifactType;

export const NodeSchema = z.object({
  id: z.string(),
  type: NodeType,
  data: z.record(z.unknown()).optional(),
});
export type Node = z.infer<typeof NodeSchema>;

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});
export type Edge = z.infer<typeof EdgeSchema>;

export const GraphSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});
export type Graph = z.infer<typeof GraphSchema>;

// Storyboard scene schema
export const SceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  start: z.number(),
  end: z.number(),
  narration: z.string(),
  equations: z.array(z.string()),
  visuals: z.array(z.string()),
});
export type Scene = z.infer<typeof SceneSchema>;

export const StoryboardSchema = z.object({
  scenes: z.array(SceneSchema),
});
export type Storyboard = z.infer<typeof StoryboardSchema>;
