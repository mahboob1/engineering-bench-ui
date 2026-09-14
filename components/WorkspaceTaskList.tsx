"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import {
    WorkspaceTask,
} from "@/types/workspace-task";

interface WorkspaceTaskListProps {
    workspaceId: string;
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

    useEffect(() => {

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

        loadTasks();

    }, [workspaceId]);

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

    if (error) {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">
                    Workspace Tasks
                </h2>

                <p>
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div>

            <h2 className="text-2xl font-bold mb-4">
                Workspace Tasks
            </h2>

            {tasks.length === 0 ? (

                <p>
                    No tasks have been created
                    for this workspace.
                </p>

            ) : (

                <div className="space-y-3">

                    {tasks.map((task) => (

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

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}