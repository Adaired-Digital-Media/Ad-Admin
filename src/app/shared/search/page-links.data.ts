import { routes } from "@/config/routes";

// Utility to convert camelCase or kebab-case to human-readable title case
const toTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Utility to flatten routes and generate page links
const generatePageLinks = () => {
  const pageLinks: { name: string; href?: string }[] = [];

  // Define section labels and their corresponding route keys
  const sectionMap: { [key: string]: string } = {
    root: "General",
    rolesNpermissions: "Users & Roles",
    products: "E-commerce",
    customForms: "Custom Forms",
    orders: "Orders",
    invoice: "Invoices",
    coupons: "Coupons",
    support: "Support",
    file: "File Manager",
    blog: "Blog",
    caseStudies: "Case Studies",
    staticPages: "Static Pages",
  };

  // Function to check if a value is a string (static route) or a function (dynamic route)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isStaticRoute = (value: any): value is string =>
    typeof value === "string";

  // Iterate through each top-level key in routes
  Object.entries(routes).forEach(([sectionKey, sectionRoutes]) => {
    // Skip external links (termsNconditions, privacyPolicy)
    if (
      sectionKey === "termsNconditions" ||
      sectionKey === "privacyPolicy" ||
      sectionKey === "auth"
    ) {
      return;
    }

    // Add section label if it exists in sectionMap
    if (sectionMap[sectionKey]) {
      pageLinks.push({ name: sectionMap[sectionKey] });
    }

    // Process nested routes
    Object.entries(sectionRoutes).forEach(([routeKey, routeValue]) => {
      if (isStaticRoute(routeValue)) {
        // Only include static routes (exclude dynamic routes like editProduct)
        pageLinks.push({
          name: toTitleCase(routeKey),
          href: routeValue,
        });
      }
    });
  });

  return pageLinks;
};

export const pageLinks = generatePageLinks();
