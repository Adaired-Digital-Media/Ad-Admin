/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAtom, useSetAtom } from "jotai";
import {
  caseStudyActionsAtom,
  caseStudiesAtom,
} from "@/store/atoms/case-studies.atom";
import { CaseStudyFormInput } from "@/validators/case-study.schema";
import { caseStudyDefaultValues } from "./form-utils";
// import { routes } from "@/config/routes";
// import { useRouter } from "next/navigation";
import PageBuilder from "@/app/shared/page-builder/page-builder";
import SeoSettings from "./seo-settings";
import { sectionRegistry } from "@/app/shared/page-builder/registry";
// import toast from "react-hot-toast";

export default function CreateEditCaseStudy({
  className,
  id,
  accessToken,
}: {
  className?: string;
  id?: string;
  accessToken?: string;
}) {
  // const router = useRouter();
  const [caseStudies] = useAtom(caseStudiesAtom);
  const setCaseStudies = useSetAtom(caseStudyActionsAtom);

  const caseStudy = caseStudies.find((cs) => cs?._id === id);

  const handleSubmit = async (data: CaseStudyFormInput) => {
    if (!accessToken) return;
    console.log("Case study data ->", data);

    // try {
    //   if (id) {
    //     const response = await setCaseStudies({
    //       type: "updateCaseStudy",
    //       token: accessToken,
    //       payload: { id: id, ...data },
    //     });
    //     if (response.status !== 200) {
    //       toast.error(response.data.message);
    //       return;
    //     }
    //     router.push(routes.caseStudies.list);
    //     toast.success(response.data.message);
    //   } else {
    //     const response = await setCaseStudies({
    //       type: "createCaseStudy",
    //       token: accessToken,
    //       payload: data,
    //     });
    //     if (response.status !== 201) {
    //       toast.error(response.data.message);
    //       return;
    //     }
    //     router.push(routes.caseStudies.list);
    //     toast.success(response.data.message);
    //   }
    // } catch (error) {
    //   console.error("Failed to save case study:", error);
    // }
  };

  const fetchData = async (id: string, token: string) => {
    const response = await setCaseStudies({
      type: "fetchAllCaseStudies",
      payload: { id },
      token,
    });
    if (response.status !== 200) {
      throw new Error(response.message);
    }
    const caseStudy = caseStudies.find((cs) => cs?._id === id);
    if (caseStudy?.bodyData) {
      (caseStudy.bodyData as any[])
        .map((section: any) => {
          const registryEntry = sectionRegistry.find(
            (entry) => entry.type === section.type
          );
          return {
            id: section.id,
            type: section.type,
            label: registryEntry?.label || "Unknown Section",
            data: section.data || {},
          };
        })
        .filter((section) => section.type !== "unknown");
    }
    return caseStudyDefaultValues(caseStudy);
  };

  return (
    <PageBuilder
      className={className}
      id={id}
      accessToken={accessToken}
      defaultValues={caseStudyDefaultValues(caseStudy)}
      onSubmit={handleSubmit}
      submitButtonText={id ? "Update Case Study" : "Create Case Study"}
      seoSettingsComponent={SeoSettings}
      fetchData={fetchData}
    />
  );
}
