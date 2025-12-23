import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  return (
    <section className="py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Contact</h1>
        <p className="text-muted-foreground mb-8">
          Heeft u vragen of opmerkingen? Neem gerust contact met ons op via
          onderstaand formulier.
        </p>
        <ContactForm />
      </div>
    </section>
  );
}
