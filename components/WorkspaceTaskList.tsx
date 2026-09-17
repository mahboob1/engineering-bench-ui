"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import {
    WorkspaceTask,
} from "@/types/workspace-task";

interface WorkspaceTaskListProps {
    workspaceId: string;
}

interface WorkspaceTaskResult {
    taskId: string;
    output: string;
}

export default function WorkspaceTaskList({
    workspaceId,
}: WorkspaceTaskListProps) {

    const [tasks, setTasks] =
        useState<WorkspaceTask[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [executingTaskId, setExecutingTaskId] =
        useState<string | null>(null);

    const [results, setResults] =
        useState<Record<string, WorkspaceTaskResult>>({});

    const [loadingResultTaskId, setLoadingResultTaskId] =
        useState<string | null>(null);

    const [newTask, setNewTask] = useState("");

    const [creatingTask, setCreatingTask] =
        useState(false);

    async function createTask() {

    if (!newTask.trim()) {
        return;
    }

    try {

        setCreatingTask(true);
        setError(null);

        const taskId =
            `task-${Date.now()}`;

        await api.post(
            "/workspace-tasks",
            {
                workspaceId: workspaceId,
                task: newTask.trim(),
            }
        );

        setNewTask("");

        await loadTasks();

    } catch (error) {

        console.error(
            "Failed to create workspace task",
            error
        );

        setError(
            "Failed to create workspace task."
        );

    } finally {

        setCreatingTask(false);
    }
}

    async function loadTasks() {

        try {

            setLoading(true);
            setError(null);

            const response =
                await api.get(
                    `/workspace-tasks/workspace/${workspaceId}`
                );

            setTasks(response.data);

        } catch (error) {

            console.error(
                "Failed to load workspace tasks",
                error
            );

            setError(
                "Failed to load workspace tasks."
            );

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        loadTasks();

    }, [workspaceId]);

    async function executeTask(taskId: string) {

        try {

            setExecutingTaskId(taskId);
            setError(null);

            await api.post(
                `/workspace-tasks/${taskId}/execute`
            );

            await loadTasks();

        } catch (error) {

            console.error(
                "Failed to execute workspace task",
                error
            );

            setError(
                "Failed to execute workspace task."
            );

            await loadTasks();

        } finally {

            setExecutingTaskId(null);
        }
    }

    async function loadResult(taskId: string) {

        try {

            setLoadingResultTaskId(taskId);
            setError(null);

            const response =
                await api.get(
                    `/workspace-tasks/${taskId}/result`
                );

            setResults((current) => ({
                ...current,
                [taskId]: response.data,
            }));

        } catch (error) {

            console.error(
                "Failed to load workspace task result",
                error
            );

            setError(
                "No execution result is available for this task."
            );

        } finally {

            setLoadingResultTaskId(null);
        }
    }

    if (loading) {
        return (
            <div>

                <h2 className="text-2xl font-bold mb-4">
                    Workspace Tasks
                </h2>

                <p>
                    Loading tasks...
                </p>

            </div>
        );
    }

    return (
        <div>

            <h2 className="text-2xl font-bold mb-4">
                Workspace Tasks
            </h2>
            {error && (
                <div className="border rounded p-3 mb-4">
                    {error}
                </div>
            )}
            <div className="border rounded p-4 mb-6">

                <div className="font-medium mb-2">
                    New Engineering Task
                </div>

                <textarea
                    value={newTask}
                    onChange={(e) =>
                        setNewTask(e.target.value)
                    }
                    placeholder="Describe the engineering task..."
                    className="border rounded p-2 w-full min-h-24"
                />

                <button
                    className="border rounded px-4 py-2 mt-3"
                    onClick={createTask}
                    disabled={
                        creatingTask ||
                        !newTask.trim()
                    }
                >
                    {creatingTask
                        ? "Creating..."
                        : "Create Task"}
                </button>

            </div>

            {tasks.length === 0 ? (

                <p>
                    No tasks have been created
                    for this workspace.
                </p>

            ) : (

                <div className="space-y-3">

                    {tasks.map((task) => {

                        const result =
                            results[task.id];

                        return (
                            <div
                                key={task.id}
                                className="border rounded p-4"
                            >

                                <div className="font-medium">
                                    {task.task}
                                </div>

                                <div className="text-sm mt-2">
                                    Status: {task.status}
                                </div>

                                <div className="flex gap-2 mt-3">

                                    <button
                                        className="border rounded px-3 py-1"
                                        onClick={() =>
                                            executeTask(task.id)
                                        }
                                        disabled={
                                            executingTaskId === task.id
                                        }
                                    >
                                        {executingTaskId === task.id
                                            ? "Executing..."
                                            : "Execute"}
                                    </button>

                                    {task.status === "COMPLETED" && (
                                        <button
                                            className="border rounded px-3 py-1"
                                            onClick={() =>
                                                loadResult(task.id)
                                            }
                                            disabled={
                                                loadingResultTaskId ===
                                                task.id
                                            }
                                        >
                                            {loadingResultTaskId ===
                                            task.id
                                                ? "Loading..."
                                                : "View Result"}
                                        </button>
                                    )}

                                </div>

                                {result && (
                                    <div className="mt-4">

                                        <div className="font-medium mb-2">
                                            Execution Result
                                        </div>

                                        <pre className="border rounded p-3 whitespace-pre-wrap overflow-auto">
                                            {result.output}
                                        </pre>

                                    </div>
                                )}

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}