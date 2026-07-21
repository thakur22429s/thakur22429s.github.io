"use client";
import { useState } from "react";
import emailjs from "@emailjs/browser";

// Same EmailJS service/template/key as the original site.
const SERVICE = "service_6kpd5tc";
const TEMPLATE = "template_h0m0inb";
const PUBLIC_KEY = "F9mNR1mzWFvcXb1FN";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE,
        TEMPLATE,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_email: "thakur22429s@gmail.com",
          time: new Date().toLocaleString(),
        },
        { publicKey: PUBLIC_KEY }
      );
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="cf-done reveal">
        Thanks — your message is on its way. I&apos;ll get back to you soon.
      </div>
    );
  }

  return (
    <form className="cform reveal" onSubmit={submit}>
      <div className="cform-row">
        <input
          className="cf-in"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={set("name")}
          required
        />
        <input
          className="cf-in"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={set("email")}
          required
        />
      </div>
      <textarea
        className="cf-in cf-msg"
        placeholder="Your message"
        value={form.message}
        onChange={set("message")}
        rows={4}
        required
      />
      <div className="cform-foot">
        <button className="btn fill" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send"} <span className="a">→</span>
        </button>
        {status === "error" && (
          <span className="cf-err">
            Failed to send — try again, or email me directly.
          </span>
        )}
      </div>
    </form>
  );
}
