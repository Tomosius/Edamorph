// src/components/navigation/NavigationLinks.ts
// This File will Contain Links to sub modules of Top and Side navigations. So for not listing every link in each file separately, we will use it all in one file

export type MenuGroup = {
    title: string;
    icon?: string;          // Optional emoji/icon
    links: {
        label: string;
        href: string;
        icon?: string;
    }[];
};

export const menuGroups: MenuGroup[] = [
    {
        title: "Correlations",
        icon: "🔗",
        links: [
            { label: "Full Matrix", href: "/correlation/matrix" },
            { label: "Pairwise Metrics", href: "/correlation/pairwise" },
            { label: "Cramér's V", href: "/correlation/cramers-v" },
            { label: "Correlation Ratio (η²)", href: "/correlation/eta" },
            { label: "Feature Heatmap", href: "/correlation/heatmap" },
        ],
    },
    {
        title: "Transformations",
        icon: "🔧",
        links: [
            { label: "Column Transformations", href: "/transformations/columns" },
            { label: "Normalizations", href: "/transformations/normalize" },
            { label: "Encodings", href: "/transformations/encodings" },
            { label: "Feature Engineering", href: "/transformations/feature-eng" },
            { label: "Generated SQL", href: "/transformations/sql-preview" },
        ],
    },
    {
        title: "Distributions",
        icon: "📊",
        links: [
            { label: "Histogram", href: "/distributions/histogram" },
            { label: "Box Plot", href: "/distributions/boxplot" },
            { label: "Quantiles", href: "/distributions/quantiles" },
            { label: "Outliers", href: "/distributions/outliers" },
            { label: "KDE", href: "/distributions/kde" },
        ],
    },
];