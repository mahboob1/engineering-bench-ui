export interface ExecutionEvent {
    id: string;
    taskId: string;
    iteration: number;
    type: string;
    message: string;
    timestamp: string;
}