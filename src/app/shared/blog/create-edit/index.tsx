/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import cn from "@/core/utils/class-names";
import { useAtom, useSetAtom } from "jotai";
import { blogActionsAtom, blogsAtom } from "@/store/atoms/blog.atom";
import { useState, useEffect } from "react";
import { Loader } from "rizzui";
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

const MAP_STEP_TO_COMPONENT = {
  [formParts.blogImage]: BlogImage,
  [formParts.blogContent]: BlogContent,
  [formParts.seoSettings]: SeoSettings,
};

type Props = {
  className?: string;
  id?: string;
  accessToken?: string;
};

const CreateEditBlog = ({ className, id, accessToken }: Props) => {
  const router = useRouter();
  const [blogs] = useAtom(blogsAtom);
  const setBlogs = useSetAtom(blogActionsAtom);
  const [isLoading, setLoading] = useState(false);

  const blog = blogs.find((b) => b?._id === id);

  const methods = useForm<BlogFormInput>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: blogDefaultValues(blog),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (!id || !accessToken) return;

    const fetchBlog = async () => {
      setLoading(true);
      try {
        if (!blog) {
          const response = await setBlogs({
            type: "fetchAllBlog",
            payload: { id },
            token: accessToken,
          });
          if (response.status !== 200) {
            toast.error(response.message);
            console.error("Failed to fetch blogs:", response.data);
            setLoading(false);
            return;
          }
        } else {
          reset(blogDefaultValues(blog));
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlog();
  }, [id, accessToken, blog, setBlogs, reset]);

  if (id && !blog && isLoading) {
    return (
      <div
        className={cn(
          `@container h-full w-full flex items-center justify-center`,
          className
        )}
      >
        <Loader variant="spinner" size="xl" />
      </div>
    );
  }

  const onSubmit: SubmitHandler<BlogFormInput> = async (data) => {
    if (!accessToken) return;
    console.log("Blog data ->", data);

    setLoading(true);
    try {
      if (id) {
        const response = await setBlogs({
          type: "updateBlog",
          token: accessToken,
          payload: { id: id, ...data },
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
            submitBtnText={id ? "Update Blog" : "Create Blog"}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateEditBlog;
