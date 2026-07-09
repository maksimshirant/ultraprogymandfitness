import ContactsSection from '@/widgets/contactssection/ui/ContactsSection';
import { Seo } from '@/seo/Seo';
import { pageSeo } from '@/seo/pageSeo';

export default function ContactsPage() {
  return (
    <>
      <Seo {...pageSeo.contacts} />
      <ContactsSection />
    </>
  );
}
