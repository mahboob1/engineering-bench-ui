export interface EngineeringProject {
    id: string;
    name: string;
    sourceRepository: {
        url: string;
        revision: string;
    };
    workingRepository: {
        url: string;
        revision: string;
    };
    collection: string;
    technology: string;
    capabilities: string[];
}
