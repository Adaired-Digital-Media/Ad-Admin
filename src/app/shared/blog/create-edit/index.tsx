/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import cn from "@/core/utils/class-names";
import { useSetAtom } from "jotai";
import { blogActionsAtom } from "@/store/atoms/blog.atom";
import { useState } from "react";
import { Element } from "react-scroll";
import { blogFormSchema, BlogFormInput } from "@/validators/blog.schema";
import FormFooter from "@/core/components/form-footer";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormNav, { formParts } from "@/app/shared/blog/create-edit/form-nav";
import BlogImage from "./blog-image";
import BlogContent from "./blog-content";
import SeoSettings from "./seo-settings";
import toast from "react-hot-toast";
import { blogDefaultValues } from "./form-utils";
import { routes } from "@/config/routes";
import { useRouter } from "next/navigation";
import { BlogTypes } from "@/core/types";

const MAP_STEP_TO_COMPONENT = {
  [formParts.blogImage]: BlogImage,
  [formParts.blogContent]: BlogContent,
  [formParts.seoSettings]: SeoSettings,
};

type Props = {
  className?: string;
  blog?: BlogTypes;
  accessToken?: string;
};

const CreateEditBlog = ({ className, blog, accessToken }: Props) => {
  const router = useRouter();
  const setBlogs = useSetAtom(blogActionsAtom);
  const [isLoading, setLoading] = useState(false);

  const methods = useForm({
    resolver: zodResolver(blogFormSchema),
    defaultValues: blogDefaultValues(blog),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<BlogFormInput> = async (data) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      if (blog) {
        const response = await setBlogs({
          type: "updateBlog",
          token: accessToken,
          payload: { id: blog._id, ...data },
        });
        if (response.status !== 200) {
          toast.error(response.data.message);
          console.error("Failed to update blog:", response);
          return;
        }
        router.push(routes.blog.list);
        toast.success(response.data.message);
      } else {
        const response = await setBlogs({
          type: "createBlog",
          token: accessToken,
          payload: data,
        });
        if (response.status !== 201) {
          toast.error(response.data.message);
          console.error("Failed to create blog:", response);
          return;
        }
        reset(blogDefaultValues(undefined));
        router.push(routes.blog.list);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Failed to save blog:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(`@container`, className)}>
      <FormNav />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {Object.entries(MAP_STEP_TO_COMPONENT).map(([key, Component]) => (
              <Element
                key={key}
                name={formParts[key as keyof typeof formParts]}
              >
                <Component className="pt-7 @2xl:pt-9 @3xl:pt-11" />
              </Element>
            ))}
          </div>
          <FormFooter
            isLoading={isLoading}
            submitBtnText={blog ? "Update Blog" : "Create Blog"}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateEditBlog;
