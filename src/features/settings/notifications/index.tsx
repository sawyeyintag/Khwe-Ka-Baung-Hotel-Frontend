import ContentSection from "../components/content-section";
import { NotificationsForm } from "./notifications-form";

export default function SettingsNotifications() {
  return (
    <ContentSection
      title='Notifications'
      desc='Configure how you receive notifications.'
    >
      <NotificationsForm />
    </ContentSection>
  );
}
