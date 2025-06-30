import { Metadata } from "next";
import CreateEditProduct from "@/app/shared/ecommerce/products/create-edit";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import { routes } from "@/config/routes";


type Props = {
  params: { slug: string };
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  return metaObject(`Edit ${slug}`);
}

const fetchProduct = async ({ slug }: { slug: string }) => {
  const apiUri = process.env.NEXT_PUBLIC_BACKEND_API_URI;

  if (!apiUri) {
    throw new Error("Backend API URI is not defined in the environment variables.");
  }

  try {
    const response = await fetch(
      `${apiUri}/product/read-product?query=${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product");
  }
};

const pageHeader = {
  title: "Edit Product",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      href: routes.products.products,
      name: "Products",
    },
    {
      name: "Edit",
    },
  ],
};

export default async function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await fetchProduct({
    slug: params.slug,
  });
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CreateEditProduct slug={params.slug} product={product.data} />
    </>
  );
}
