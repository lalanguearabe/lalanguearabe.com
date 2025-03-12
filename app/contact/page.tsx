"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";


export default function ContactPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:anislerouge@gmail.com?subject=Contact from ${name}&body=${message}%0A%0AFrom: ${name}%0AEmail: ${email}`;
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t('CONTACT.TITLE')}
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t('CONTACT.DESCRIPTION')}
              </p>
            </div>
          </div>
          
          <div className="mx-auto max-w-lg mt-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg bg-muted">
                <Mail className="h-12 w-12 text-primary" />
                <h2 className="text-2xl font-bold">{t('CONTACT.THANK_YOU')}</h2>
                <p className="text-center text-muted-foreground">
                  {t('CONTACT.EMAIL_SENT')}
                </p>
                <Button onClick={() => setSubmitted(false)}>
                  {t('CONTACT.SEND_ANOTHER')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('CONTACT.FORM.NAME')}
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={t('CONTACT.FORM.NAME_PLACEHOLDER')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('CONTACT.FORM.EMAIL')}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('CONTACT.FORM.EMAIL_PLACEHOLDER')}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('CONTACT.FORM.MESSAGE')}
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder={t('CONTACT.FORM.MESSAGE_PLACEHOLDER')}
                    className="min-h-[150px]"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t('CONTACT.FORM.SUBMIT')}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground mt-4">
                  <p>{t('CONTACT.DIRECT_EMAIL')} <a href="mailto:anislerouge@gmail.com" className="text-primary hover:underline">anislerouge@gmail.com</a></p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
