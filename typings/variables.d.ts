type package_manager = "npm" | "yarn" | "pnpm";

type framework = "adonisjs" | "nextjs" | "react native" | "strapi";

type initial_input = {
    projectName: string;
    packageManager: package_manager;
};

type prompt = {
    type: string;
    name: string;
    message: string;
    choices?: Array<string>;
    default?: boolean;
}

type frameworkConfig = {
    [key in framework]: {
        prompts?: Array<prompt>;
        "package-manager": package_manager[];
    };
}