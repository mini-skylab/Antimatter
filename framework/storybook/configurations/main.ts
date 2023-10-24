import {applyRepositoryWideModifications} from "@miniskylab/webpack";
import type {StorybookConfig} from "@storybook/react-webpack5";
import findWorkspaceRoot from "find-yarn-workspace-root";
import path from "path";

export default {
    core: {
        disableTelemetry: true
    },
    framework: {
        name: "@storybook/react-webpack5",
        options: {}
    },
    docs: {
        docsMode: true
    },
    staticDirs: ["../static-assets"],
    stories: [
        "../../../**/stories/index.mdx",
        "../../../**/stories/stories.tsx"
    ],
    addons: [
        "@storybook/addon-docs",
        "@storybook/addon-measure",
        "@storybook/addon-controls",
        "@storybook/addon-a11y",
        "@storybook/addon-actions",
        "@storybook/addon-links"
    ],
    typescript: {
        reactDocgen: "react-docgen-typescript",
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            tsconfigPath: path.join(findWorkspaceRoot(), "tsconfig.json"),
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
        }
    },
    async webpackFinal(storybookDefault, {configType: mode})
    {
        applyRepositoryWideModifications(storybookDefault, mode);
        return storybookDefault;
    },
    async babel(storybookDefault)
    {
        return {...storybookDefault, rootMode: "upward"};
    }
} satisfies StorybookConfig;
