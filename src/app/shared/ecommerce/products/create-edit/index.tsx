/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  productFormSchema,
  ProductFormValues,
} from "@/validators/create-product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ProductSummary from "@/app/shared/ecommerce/products/create-edit/product-summary";
import ProductFeaturedImage from "@/app/shared/ecommerce/products/create-edit/product-featured-image";
import ProductPricingInventory from "@/app/shared/ecommerce/products/create-edit/pricing-inventory";
import ProductImagesGallery from "@/app/shared/ecommerce/products/create-edit/product-media";
import ProductSeo from "@/app/shared/ecommerce/products/create-edit/product-seo";
import CustomFields from "@/app/shared/ecommerce/products/create-edit/custom-fields";
import { defaultValues } from "@/app/shared/ecommerce/products/create-edit/form-utils";
import FormNav, {
  formParts,
} from "@/app/shared/ecommerce/products/create-edit/form-nav";
import toast from "react-hot-toast";
import cn from "@/core/utils/class-names";
import FormFooter from "@core/components/form-footer";
import { Element } from "react-scroll";
import { useApiCall } from "@/core/utils/api-config";

const MAP_STEP_TO_COMPONENT = {
  [formParts.summary]: ProductSummary,
  [formParts.featuredImage]: ProductFeaturedImage,
  [formParts.pricingInventory]: ProductPricingInventory,
  [formParts.media]: ProductImagesGallery,
  [formParts.seo]: ProductSeo,
  [formParts.productIdentifiers]: CustomFields,
};

interface IndexProps {
  slug?: string;
  className?: string;
  product?: ProductFormValues;
}
export default function CreateEditProduct({
  className,
  slug,
  product,
}: IndexProps) {
  const { apiCall } = useApiCall();
  const [isLoading, setLoading] = useState(false);
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues(product),
  });

  const handleCreateProduct = async (data: ProductFormValues) => {
    try {
      const _response = await apiCall<{ message: string }>({
        url: `/product/create-product`,
        method: "POST",
        data,
      });

      if (_response.status === 201) {
        toast.success(_response.data.message);
        await fetch("/api/revalidateTags?tags=products", {
          method: "GET",
        });
      }
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast.error(error.message);
    }
  };

  const handleUpdateProduct = async (data: ProductFormValues) => {
    try {
      const _response = await apiCall<{ message: string }>({
        url: `/product/update-product?query=${slug}`,
        method: "PATCH",
        data,
      });
      if (_response.status === 200) {
        toast.success(_response.data.message);
        await fetch("/api/revalidateTags?tags=products", {
          method: "GET",
        });
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error(error.message);
    }
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    setLoading(true);
    if (product) {
      await handleUpdateProduct(data);
    } else {
      await handleCreateProduct(data);
    }

    setLoading(false);
  };

  return (
    <div className="@container">
      <FormNav />
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className={cn(
            "relative z-[19] [&_label.block>span]:font-medium",
            className
          )}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                {<Component className="pt-7 @2xl:pt-9 @3xl:pt-11" />}
              </Element>
            ))}
          </div>

          <FormFooter
            isLoading={isLoading}
            submitBtnText={slug ? "Update Product" : "Create Product"}
          />
        </form>
      </FormProvider>
    </div>
  );
}
