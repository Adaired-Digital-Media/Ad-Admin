import Link from "next/link";
import { PiPlusBold } from "react-icons/pi";
import { routes } from "@/config/routes";
import { Button } from "rizzui";
import PageHeader from "@/app/shared/page-header";
import { metaObject } from "@/config/site.config";
import { auth } from "@/auth";
import CaseStudyTable from "@/app/shared/case-studies/list/table";
import { fetchData } from "@/core/utils/fetch-function";
import { CaseStudyType } from "@/core/types";

export const metadata = {
  ...metaObject("Case Study"),
};

const pageHeader = {
  title: "Case Studies",
  breadcrumb: [
    {
      href: routes?.root?.dashboard,
      name: "Dashboard",
    },
    {
      href: routes?.caseStudies?.list,
      name: "Case Studies",
    },
    {
      name: "List",
    },
  ],
};

const CaseStudyPage = async () => {
  const session = await auth();
  const accessToken = session?.user?.accessToken || "";
  const caseStudyList = await fetchData({
    endpoint: "/case-study/read",
    accessToken,
    tag: "case-study",
  });
  return (
    <div className="p-4">
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link
            href={routes?.caseStudies?.create}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Add Case Study
            </Button>
          </Link>
        </div>
      </PageHeader>
      <CaseStudyTable
        initialCaseStudies={caseStudyList as CaseStudyType[]}
        session={session!}
      />
    </div>
  );
};

export default CaseStudyPage;
