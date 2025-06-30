/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAtom } from "jotai";
import { useState, useEffect, lazy, Suspense, ComponentType } from "react";
import { Loader, Button } from "rizzui";
import { Element } from "react-scroll";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  DefaultValues,
} from "react-hook-form";
import cn from "@/core/utils/class-names";
import ModalButton from "@/app/shared/modal-button";
import SectionSelectorModal from "./section-selector-modal";
import SectionManagerWidget from "./section-manager-widget";
import PageNav from "./page-nav";
import { dynamicSectionsAtom } from "./page-nav";
import { sectionRegistry } from "./registry";
import toast from "react-hot-toast";

export interface PageBuilderProps<T extends Record<string, any>> {
  className?: string;
  id?: string;
  accessToken?: string;
  defaultValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  submitButtonText?: string;
  seoSettingsComponent: ComponentType<{ className?: string }>;
  fetchData?: (id: string, token: string) => Promise<any>;
}

const sectionComponents: { [key: string]: ComponentType<any> } = {};

export default function PageBuilder<T extends Record<string, any>>({
  className,
  id,
  accessToken,
  defaultValues,
  onSubmit,
  submitButtonText = "Save",
  seoSettingsComponent: SeoSettings,
  fetchData,
}: PageBuilderProps<T>) {
  const [isLoading, setLoading] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [dynamicSections] = useAtom(dynamicSectionsAtom);

  const methods = useForm<T>({
    defaultValues,
  });
  const { handleSubmit, reset, watch } = methods;

  // Dynamically import section components
  useEffect(() => {
    const loadComponents = async () => {
      const promises = sectionRegistry.map(async (section) => {
        if (!sectionComponents[section.type]) {
          try {
            const component = await import(`./sections/${section.component}`);
            sectionComponents[section.type] = lazy(() =>
              Promise.resolve(component)
            );
          } catch (err) {
            console.error(`Failed to load section ${section.component}:`, err);
            sectionComponents[section.type] = () => (
              <div>Error loading section: {section.label}</div>
            );
          }
        }
      });
      await Promise.all(promises);
      setComponentsLoaded(true);
    };
    loadComponents();
  }, []);

  // Fetch data for editing
  useEffect(() => {
    if (!id || !accessToken || !fetchData) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await fetchData(id, accessToken);
        reset(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to fetch data");
        setLoading(false);
      }
    };
    fetch();
  }, [id, accessToken, fetchData, reset]);

  if (id && isLoading) {
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

  if (!componentsLoaded) {
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

  return (
    <div className={cn(`@container relative`, className)}>
      <PageNav />
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit((data) => {
            console.log("Form values before submission:", watch());
            const formattedBodyData = dynamicSections.map((section, index) => ({
              id: section.id,
              type: section.type,
              label: section.label,
              data: data.bodyData?.[index]?.data || {},
            }));
            onSubmit({ ...data, bodyData: formattedBodyData } as T);
          })}
        >
          <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
            {dynamicSections.map((section) => {
              const Component = sectionComponents[section.type];
              if (!Component) {
                return (
                  <div
                    key={section.id}
                    className="text-red-500 pt-7 @2xl:pt-9 @3xl:pt-11"
                  >
                    Error: Component for {section.label} not found
                  </div>
                );
              }
              return (
                <Element key={section.id} name={section.id}>
                  <Suspense fallback={<Loader variant="spinner" size="lg" />}>
                    <Component
                      className="pt-7 @2xl:pt-9 @3xl:pt-11"
                      namespace={`bodyData[${dynamicSections.indexOf(
                        section
                      )}].data`}
                      formMethods={methods}
                    />
                  </Suspense>
                </Element>
              );
            })}
            <Element name="seoSettings">
              <SeoSettings className="pt-7 @2xl:pt-9 @3xl:pt-11" />
            </Element>
          </div>

          <div
            className={cn(
              "sticky bottom-0 left-0 right-0 z-10 -mb-8 flex items-center justify-end gap-4 border-t bg-white px-4 py-4 md:px-5 lg:px-6 3xl:px-8 4xl:px-10 dark:bg-gray-50 -mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10"
            )}
          >
            <ModalButton label="Add Section" view={<SectionSelectorModal />} />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full @xl:w-auto"
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      </FormProvider>
      <SectionManagerWidget />
    </div>
  );
}
