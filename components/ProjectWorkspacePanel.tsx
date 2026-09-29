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

    const [showCreateProject, setShowCreateProject] =
        useState(false);

    const [projectId, setProjectId] =
        useState("");

    const [projectName, setProjectName] =
        useState("");

    const [repositoryUrl, setRepositoryUrl] =
        useState("");

    const [repositoryRevision, setRepositoryRevision] =
        useState("main");

    const [workingRepositoryUrl, setWorkingRepositoryUrl] =
        useState("");

    const [workingRepositoryRevision, setWorkingRepositoryRevision] =
        useState("main");

    const [collection, setCollection] =
        useState("");

    const [language, setLanguage] =
        useState("");

    const [framework, setFramework] =
        useState("");

    const [buildTool, setBuildTool] =
        useState("");

    const [showCreateWorkspace, setShowCreateWorkspace] =
    useState(false);

    const [workspaceId, setWorkspaceId] =
        useState("");

    const [workspaceRevision, setWorkspaceRevision] =
        useState("main");

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

    useEffect(() => {
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

    async function createProject() {

        try {

            const response =
                await api.post("/projects", {
                    id: projectId,
                    name: projectName,
                    sourceRepository: {
                        url: repositoryUrl,
                        revision: repositoryRevision
                    },
                    workingRepository: {
                        url: workingRepositoryUrl,
                        revision: workingRepositoryRevision
                    },
                    collection,
                    technology: {
                        language,
                        framework,
                        buildTool
                    },
                    capabilities: []
                });

            setProjects((current) => [
                ...current,
                response.data
            ]);

            setSelectedProjectId(response.data.id);

            setShowCreateProject(false);

            setProjectId("");
            setProjectName("");
            setRepositoryUrl("");
            setRepositoryRevision("main");
            setWorkingRepositoryUrl("");
            setWorkingRepositoryRevision("main");
            setCollection("");
            setLanguage("");
            setFramework("");
            setBuildTool("");

        } catch (error) {

            console.error(
                "Failed to create project",
                error
            );
        }
    }

    async function createWorkspace() {

    try {

        const response =
            await api.post("/workspaces/from-project", null, {
                params: {
                    projectId: selectedProjectId,
                    workspaceId,
                    revision: workspaceRevision
                }
            });

        setWorkspaces((current) => [
            ...current,
            response.data
        ]);

        setSelectedWorkspaceId(response.data.id);

        setShowCreateWorkspace(false);

        setWorkspaceId("");
        setWorkspaceRevision("main");

        } catch (error) {

            console.error(
                "Failed to create workspace",
                error
            );
        }
    }

    return (
        <div>

            <h2 className="text-2xl font-bold mb-6">
                Projects
            </h2>

            <div className="flex gap-3 mb-6">

                <select
                    className="border p-2 w-full max-w-xl"
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

                <button
                    className="border px-4 py-2"
                    onClick={() =>
                        setShowCreateProject(
                            !showCreateProject
                        )
                    }
                >
                    {showCreateProject
                        ? "Cancel"
                        : "Create Project"}
                </button>

            </div>

            {showCreateProject && (
                <div className="border p-6 mb-8 max-w-xl">

                    <h3 className="text-xl font-semibold mb-4">
                        New Project
                    </h3>

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Project ID"
                        value={projectId}
                        onChange={(event) =>
                            setProjectId(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Project name"
                        value={projectName}
                        onChange={(event) =>
                            setProjectName(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Source repository URL"
                        value={repositoryUrl}
                        onChange={(event) =>
                            setRepositoryUrl(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Source revision"
                        value={repositoryRevision}
                        onChange={(event) =>
                            setRepositoryRevision(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Working repository URL"
                        value={workingRepositoryUrl}
                        onChange={(event) =>
                            setWorkingRepositoryUrl(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Working repository revision"
                        value={workingRepositoryRevision}
                        onChange={(event) =>
                            setWorkingRepositoryRevision(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Collection"
                        value={collection}
                        onChange={(event) =>
                            setCollection(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Language"
                        value={language}
                        onChange={(event) =>
                            setLanguage(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-3"
                        placeholder="Framework"
                        value={framework}
                        onChange={(event) =>
                            setFramework(event.target.value)
                        }
                    />

                    <input
                        className="border p-2 w-full mb-4"
                        placeholder="Build tool"
                        value={buildTool}
                        onChange={(event) =>
                            setBuildTool(event.target.value)
                        }
                    />

                    <button
                        className="border px-4 py-2"
                        onClick={createProject}
                    >
                        Create Project
                    </button>

                </div>
            )}

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
                
                <button
                    className="border px-4 py-2 mb-8"
                    onClick={() =>
                        setShowCreateWorkspace(
                            !showCreateWorkspace
                        )
                    }
                >
                    {showCreateWorkspace
                        ? "Cancel"
                        : "Create Workspace"}
                </button>

                {showCreateWorkspace && (
                    <div className="border p-6 mb-8 max-w-xl">

                        <h3 className="text-xl font-semibold mb-4">
                            New Workspace
                        </h3>

                        <input
                            className="border p-2 w-full mb-3"
                            placeholder="Workspace ID"
                            value={workspaceId}
                            onChange={(event) =>
                                setWorkspaceId(event.target.value)
                            }
                        />

                        <input
                            className="border p-2 w-full mb-4"
                            placeholder="Revision"
                            value={workspaceRevision}
                            onChange={(event) =>
                                setWorkspaceRevision(event.target.value)
                            }
                        />

                        <button
                            className="border px-4 py-2"
                            onClick={createWorkspace}
                        >
                            Create Workspace
                        </button>

                    </div>
                )}
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