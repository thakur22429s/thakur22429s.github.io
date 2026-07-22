import { profile } from "@/data/content";
import ContactForm from "@/components/ContactForm";

export default function Footer() {
  return (
    <footer className="foot wrap" id="contact">
      <span className="eyebrow">the last page</span>
      <h2 className="dsp">Let&apos;s talk.</h2>
      <ContactForm />
      <div className="row">
        <a href={`mailto:${profile.email}`}>Email</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={profile.resume} target="_blank" rel="noopener noreferrer">
          Résumé
        </a>
      </div>
      <div className="cr">© {new Date().getFullYear()} {profile.name}</div>
    </footer>
  );
}
