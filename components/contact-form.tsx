'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnstile?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  /*
   * Persistent Script Loader Strategy
   * 1. Check if script exists, if not create it.
   * 2. Do NOT remove script on unmount.
   * 3. Wait for window.turnstile to be defined.
   * 4. Explicitly render widget.
   */
  useEffect(() => {
    if (!siteKey) {
      console.warn('Turnstile site key missing');
      return;
    }

    let mounted = true;

    const renderWidget = () => {
      if (!mounted || !turnstileRef.current || !window.turnstile) return;

      // Clean up existing widget if any to prevent duplicates
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = '';
      }

      try {
        const id = window.turnstile.render(turnstileRef.current, {
          sitekey: siteKey,
          callback: (token: string) => {
            setTurnstileToken(token);
            setErrors((prev) => ({ ...prev, turnstile: undefined }));
          },
          'error-callback': () => {
            setErrors((prev) => ({
              ...prev,
              turnstile: 'Verificatie mislukt. Probeer het opnieuw.',
            }));
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
          theme: 'auto',
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error('Turnstile render error:', err);
      }
    };

    // Check availability
    if (window.turnstile) {
      renderWidget();
    } else {
      // Ensure script is injected
      const scriptId = 'turnstile-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src =
          'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }

      // Poll for availability (robust against already-loading scripts)
      const intervalId = setInterval(() => {
        if (window.turnstile) {
          clearInterval(intervalId);
          renderWidget();
        }
      }, 100);

      // Cleanup polling on unmount
      return () => {
        mounted = false;
        clearInterval(intervalId);
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = '';
        }
      };
    }

    return () => {
      mounted = false;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = '';
      }
    };
  }, [siteKey]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Naam is verplicht';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ongeldig e-mailadres';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Onderwerp is verplicht';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Bericht is verplicht';
    }

    // Only validate turnstile if the site key is configured
    if (siteKey && !turnstileToken) {
      newErrors.turnstile = 'Gelieve de verificatie te voltooien';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTurnstileToken('');
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">
          Naam <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Uw naam"
          aria-invalid={!!errors.name}
        />
        <FieldError>{errors.name}</FieldError>
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">
          E-mailadres <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="uw.email@voorbeeld.be"
          aria-invalid={!!errors.email}
        />
        <FieldError>{errors.email}</FieldError>
      </Field>

      <Field data-invalid={!!errors.subject}>
        <FieldLabel htmlFor="subject">
          Onderwerp <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Onderwerp van uw bericht"
          aria-invalid={!!errors.subject}
        />
        <FieldError>{errors.subject}</FieldError>
      </Field>

      <Field data-invalid={!!errors.message}>
        <FieldLabel htmlFor="message">
          Bericht <span className="text-destructive">*</span>
        </FieldLabel>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Uw bericht..."
          rows={6}
          aria-invalid={!!errors.message}
        />
        <FieldError>{errors.message}</FieldError>
      </Field>

      {siteKey && (
        <Field data-invalid={!!errors.turnstile}>
          <div ref={turnstileRef}></div>
          <FieldError>{errors.turnstile}</FieldError>
        </Field>
      )}

      {submitStatus === 'success' && (
        <Alert>
          <AlertDescription>
            Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>
            Er is een fout opgetreden bij het verzenden van uw bericht. Probeer
            het later opnieuw.
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Verzenden...' : 'Verzend bericht'}
      </Button>
    </form>
  );
}
