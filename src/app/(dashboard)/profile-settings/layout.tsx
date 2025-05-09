import { routes } from "@/config/routes";
import PageHeader from "@/app/shared/page-header";
import ProfileSettingsNav from "@/app/shared/account-settings/navigation";

const pageHeader = {
  title: "Account Settings",
  breadcrumb: [
    {
      href: routes.root.dashboard,
      name: "Dashboard",
    },
    {
      name: "Account Settings",
    },
  ],
};

export default function ProfileSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProfileSettingsNav />
      {children}
    </>
  );
}
