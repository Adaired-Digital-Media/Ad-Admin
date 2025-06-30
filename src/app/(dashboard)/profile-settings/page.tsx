import { metaObject } from '@/config/site.config';
import ProfileSettingsView from '@/app/shared/account-settings/personal-info';
import { auth } from '@/auth';
export const metadata = {
    ...metaObject('Profile Settings'),
  };
  
  export default async function ProfileSettingsFormPage() {
    const session = await auth();
    if (!session) {
      throw new Error('User session is not available.');
    }
    return <ProfileSettingsView/>;
  }