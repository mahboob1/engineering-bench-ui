"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { EngineeringProject } from "@/types/engineering-project";
import { EngineeringWorkspace } from "@/types/engineering-workspace";
import WorkspaceTaskList from "@/components/WorkspaceTaskList";

export default function ProjectWorkspacePanel() {

    const [projects, setProjects] =
        useState<EngineeringProject[]>([]);

    const [workspaces, setWorkspaces] =
        useState<EngineeringWorkspace[]>([]);

    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [selectedWorkspaceId, setSelectedWorkspaceId] =
        useState("");

    useEffect(() => {

        async function loadProjects() {

            try {

                const response =
                    await api.get("/projects");

                setProjects(response.data);

            } catch (error) {

                console.error(
                    "Failed to load projects",
                    error
                );
            }
        }

        loadProjects();

    }, []);

    useEffect(() => {

        async function loadWorkspaces() {

            if (!selectedProjectId) {
                setWorkspaces([]);
                setSelectedWorkspaceId("");
                return;
            }

            try {

                const response =
                    await api.get("/workspaces");

                const projectWorkspaces =
                    response.data.filter(
                        (workspace: EngineeringWorkspace) =>
                            workspace.projectId === selectedProjectId
                    );

                setWorkspaces(projectWorkspaces);
                setSelectedWorkspaceId("");

            } catch (error) {

                console.error(
                    "Failed to load workspaces",
                    error
                );
            }
        }

        loadWorkspaces();

    }, [selectedProjectId]);

    return (
        <div>

            <h2 className="text-2xl font-bold mb-6">
                Projects
            </h2>

            <select
                className="border p-2 mb-6 w-full max-w-xl"
                value={selectedProjectId}
                onChange={(event) =>
                    setSelectedProjectId(event.target.value)
                }
            >
                <option value="">
                    Select a project
                </option>

                {projects.map((project) => (
                    <option
                        key={project.id}
                        value={project.id}
                    >
                        {project.name}
                    </option>
                ))}
            </select>

            {selectedProjectId && (
                <>
                    <h3 className="text-xl font-semibold mb-4">
                        Workspaces
                    </h3>

                    <select
                        className="border p-2 mb-8 w-full max-w-xl"
                        value={selectedWorkspaceId}
                        onChange={(event) =>
                            setSelectedWorkspaceId(
                                event.target.value
                            )
                        }
                    >
                        <option value="">
                            Select a workspace
                        </option>

                        {workspaces.map((workspace) => (
                            <option
                                key={workspace.id}
                                value={workspace.id}
                            >
                                {workspace.id} ({workspace.revision})
                            </option>
                        ))}
                    </select>
                </>
            )}

            {selectedWorkspaceId && (
                <WorkspaceTaskList
                    workspaceId={selectedWorkspaceId}
                />
            )}

        </div>
    );
}
