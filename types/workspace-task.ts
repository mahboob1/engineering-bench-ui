export type WorkspaceTaskStatus =
  | "CREATED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface WorkspaceTask {
  id: string;
  workspaceId: string;
  task: string;
  status: WorkspaceTaskStatus;
}