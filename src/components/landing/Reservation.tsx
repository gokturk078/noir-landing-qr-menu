import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, MessageSquare, MapPin, Phone, Mail } from 'lucide-react';
import { useMemo, useRef, useState, type FormEvent, type RefObject } from 'react';
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/ToastProvider';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

type ReservationForm = {
  name: string;
  phoneDigits: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
};

function normalizeDigits(input: string) {
  return input.replace(/\D/g, '');
}

function formatTrPhone(digits: string) {
  const raw = normalizeDigits(digits);
  const withoutCountry = raw.startsWith('90') ? raw.slice(2) : raw;
  const withoutLeadingZero = withoutCountry.startsWith('0') ? withoutCountry.slice(1) : withoutCountry;
  const trimmed = withoutLeadingZero.slice(0, 10);

  const p1 = trimmed.slice(0, 3);
  const p2 = trimmed.slice(3, 6);
  const p3 = trimmed.slice(6, 8);
  const p4 = trimmed.slice(8, 10);

  if (trimmed.length === 0) return '';
  if (trimmed.length <= 3) return `+90 (${p1}`;
  if (trimmed.length <= 6) return `+90 (${p1}) ${p2}`;
  if (trimmed.length <= 8) return `+90 (${p1}) ${p2} ${p3}`;
  return `+90 (${p1}) ${p2} ${p3} ${p4}`;
}

function isValidEmail(email: string) {
  const value = email.trim();
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

function toIsoDateString(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isPastDate(isoDate: string) {
  if (!isoDate) return false;
  const today = new Date();
  const floorToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [y, m, d] = isoDate.split('-').map(Number);
  const selected = new Date(y, (m || 1) - 1, d || 1);
  return selected < floorToday;
}

function isWithinTimeRange(time: string, min: string, max: string) {
  if (!time) return false;
  return time >= min && time <= max;
}

export default function Reservation() {
  const { t } = useTranslation();
  const { push } = useToast();
  const todayIso = useMemo(() => toIsoDateString(new Date()), []);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [maxStep, setMaxStep] = useState<1 | 2 | 3>(1);

  const [form, setForm] = useState<ReservationForm>({
    name: '',
    phoneDigits: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    requests: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationForm, string>>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLInputElement>(null);
  const guestsRef = useRef<HTMLSelectElement>(null);
  const requestsRef = useRef<HTMLTextAreaElement>(null);

  const phoneDisplay = useMemo(() => formatTrPhone(form.phoneDigits), [form.phoneDigits]);
  const minTime = '12:00';
  const maxTime = '23:59';

  const setField = <K extends keyof ReservationForm>(key: K, value: ReservationForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (input: ReservationForm) => {
    const next: Partial<Record<keyof ReservationForm, string>> = {};

    if (input.name.trim().length < 2) next.name = t('error_name');
    const digits = normalizeDigits(input.phoneDigits);
    if (digits.length < 10) next.phoneDigits = t('error_phone');
    if (!isValidEmail(input.email)) next.email = t('error_email');
    if (!input.date) next.date = t('error_required');
    if (input.date && isPastDate(input.date)) next.date = t('error_date_past');
    if (!input.time) next.time = t('error_required');
    if (input.time && !isWithinTimeRange(input.time, minTime, maxTime)) next.time = t('error_time_range');
    if (!input.guests) next.guests = t('error_required');
    if (input.requests.trim().length > 300) next.requests = t('error_requests_max');

    return next;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);

    const firstKey = (Object.keys(next) as (keyof ReservationForm)[])[0];
    if (firstKey) {
      const map: Record<keyof ReservationForm, RefObject<any>> = {
        name: nameRef,
        phoneDigits: phoneRef,
        email: emailRef,
        date: dateRef,
        time: timeRef,
        guests: guestsRef,
        requests: requestsRef,
      };
      map[firstKey]?.current?.focus?.();
      return;
    }

    push({ title: t('reservation_success'), variant: 'success' });
    setForm((prev) => ({ ...prev, requests: '' }));
    setStep(1);
    setMaxStep(1);
  };

  const validateStep = (targetStep: 1 | 2 | 3, input: ReservationForm) => {
    const all = validate(input);
    const allow: (keyof ReservationForm)[] =
      targetStep === 1
        ? ['date', 'time', 'guests']
        : targetStep === 2
          ? ['name', 'phoneDigits', 'email']
          : ['requests'];

    const next: Partial<Record<keyof ReservationForm, string>> = {};
    for (const key of allow) {
      if (all[key]) next[key] = all[key];
    }
    return next;
  };

  const goNext = () => {
    const nextStep = (step + 1) as 2 | 3;
    const nextErrors = validateStep(step, form);
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    const has = Object.keys(nextErrors).length > 0;
    if (has) {
      const firstKey = (Object.keys(nextErrors) as (keyof ReservationForm)[])[0];
      const map: Record<keyof ReservationForm, RefObject<any>> = {
        name: nameRef,
        phoneDigits: phoneRef,
        email: emailRef,
        date: dateRef,
        time: timeRef,
        guests: guestsRef,
        requests: requestsRef,
      };
      map[firstKey]?.current?.focus?.();
      return;
    }
    setStep(nextStep);
    setMaxStep((prev) => (prev < nextStep ? nextStep : prev));
  };

  const goBack = () => setStep((prev) => (prev === 1 ? prev : ((prev - 1) as 1 | 2)));

  return (
    <section id="reservation" className="py-16 sm:py-24 bg-obsidian text-ivory relative">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col-reverse lg:flex-row gap-10 sm:gap-16 lg:gap-24">
        
        {/* Info Side */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <div>
            <span className="font-accent text-gold text-sm tracking-[0.2em] uppercase block mb-4">{t('contact')}</span>
            <h2 className="font-display italic text-3xl sm:text-4xl md:text-5xl text-ivory mb-5 leading-tight">{t('reservation')}</h2>
            <p className="font-body text-silver leading-relaxed">
              {t('reservation_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <a
              href={RESTAURANT_INFO.socials.maps}
              target="_blank"
              rel="noreferrer"
              className="sm:col-span-2 bg-charcoal/40 border border-white/5 rounded-lg p-4 flex items-start gap-3 hover:border-gold/30 transition-colors"
            >
              <MapPin className="text-gold mt-0.5 shrink-0" size={18} />
              <div className="min-w-0">
                <div className="font-accent text-[11px] uppercase tracking-widest text-ash">{t('address')}</div>
                <div className="text-silver text-sm leading-relaxed break-words">{RESTAURANT_INFO.address}</div>
              </div>
            </a>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="bg-charcoal/40 border border-white/5 rounded-lg p-4 flex items-start gap-3 hover:border-gold/30 transition-colors"
            >
              <Phone className="text-gold mt-0.5 shrink-0" size={18} />
              <div className="min-w-0">
                <div className="font-accent text-[11px] uppercase tracking-widest text-ash">{t('phone')}</div>
                <div className="text-silver text-sm leading-relaxed break-words">{RESTAURANT_INFO.phone}</div>
              </div>
            </a>

            <a
              href={`mailto:${RESTAURANT_INFO.email}`}
              className="bg-charcoal/40 border border-white/5 rounded-lg p-4 flex items-start gap-3 hover:border-gold/30 transition-colors"
            >
              <Mail className="text-gold mt-0.5 shrink-0" size={18} />
              <div className="min-w-0">
                <div className="font-accent text-[11px] uppercase tracking-widest text-ash">{t('email')}</div>
                <div className="text-silver text-sm leading-relaxed break-words">{RESTAURANT_INFO.email}</div>
              </div>
            </a>

            <div className="bg-charcoal/40 border border-white/5 rounded-lg p-4 flex items-start gap-3">
              <Clock className="text-gold mt-0.5 shrink-0" size={18} />
              <div className="min-w-0">
                <div className="font-accent text-[11px] uppercase tracking-widest text-ash">{t('working_hours')}</div>
                <div className="text-silver text-sm leading-relaxed break-words">{t('opening_hours')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full lg:w-2/3 bg-charcoal/50 p-5 sm:p-8 md:p-12 rounded-sm border border-white/5">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {([1, 2, 3] as const).map((n) => {
                const isActive = step === n;
                const isDone = n < step || (n <= maxStep && n !== step);
                const isLocked = n > maxStep;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => (isLocked ? null : setStep(n))}
                    disabled={isLocked}
                    aria-current={isActive ? 'step' : undefined}
                    className={cn(
                      'h-9 px-3 rounded-full border text-xs font-mono tracking-widest transition-colors',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      isActive
                        ? 'bg-gold/15 text-gold border-gold/40'
                        : isDone
                          ? 'bg-white/5 text-ivory border-white/15 hover:border-gold/30'
                          : 'bg-white/5 text-silver border-white/10 hover:border-white/20 hover:text-ivory'
                    )}
                  >
                    {t('step')} {n}
                  </button>
                );
              })}
            </div>
            <div className="text-[11px] text-ash uppercase tracking-widest font-accent">
              {step === 1 ? t('reservation_details') : step === 2 ? t('contact') : t('review')}
            </div>
          </div>
          <div className="mb-6">
            <div className="h-px w-full bg-white/10" />
            <div
              className="h-px bg-gold/60 -mt-px transition-[width] duration-300"
              style={{ width: step === 1 ? '33.333%' : step === 2 ? '66.666%' : '100%' }}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
                >
                  <div className="space-y-2">
                    <label className="text-xs text-gold uppercase tracking-wider font-bold">{t('date')}</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" size={18} />
                      <input
                        ref={dateRef}
                        type="date"
                        value={form.date}
                        onChange={(e) => setField('date', e.target.value)}
                        min={todayIso}
                        className={cn(
                          "w-full bg-obsidian border p-4 pl-12 text-ivory outline-none transition-colors text-base",
                          errors.date ? "border-rouge/60 focus:border-rouge" : "border-white/10 focus:border-gold"
                        )}
                        aria-invalid={Boolean(errors.date)}
                        aria-describedby={errors.date ? "reservation-date-error" : undefined}
                      />
                    </div>
                    {errors.date ? (
                      <div id="reservation-date-error" className="text-xs text-rouge">{errors.date}</div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gold uppercase tracking-wider font-bold">{t('time')}</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" size={18} />
                      <input
                        ref={timeRef}
                        type="time"
                        value={form.time}
                        onChange={(e) => setField('time', e.target.value)}
                        min={minTime}
                        max={maxTime}
                        className={cn(
                          "w-full bg-obsidian border p-4 pl-12 text-ivory outline-none transition-colors text-base",
                          errors.time ? "border-rouge/60 focus:border-rouge" : "border-white/10 focus:border-gold"
                        )}
                        aria-invalid={Boolean(errors.time)}
                        aria-describedby={errors.time ? "reservation-time-error" : undefined}
                      />
                    </div>
                    {errors.time ? (
                      <div id="reservation-time-error" className="text-xs text-rouge">{errors.time}</div>
                    ) : null}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-xs text-gold uppercase tracking-wider font-bold">{t('guests')}</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" size={18} />
                      <select
                        ref={guestsRef}
                        value={form.guests}
                        onChange={(e) => setField('guests', e.target.value)}
                        className={cn(
                          "w-full bg-obsidian border p-4 pl-12 text-ivory outline-none transition-colors appearance-none text-base",
                          errors.guests ? "border-rouge/60 focus:border-rouge" : "border-white/10 focus:border-gold"
                        )}
                        aria-invalid={Boolean(errors.guests)}
                        aria-describedby={errors.guests ? "reservation-guests-error" : undefined}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, '8+'].map(n => (
                          <option key={n} value={n}>
                            {typeof n === 'number' ? t('guests_count', { count: n }) : t('guests_8_plus')}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.guests ? (
                      <div id="reservation-guests-error" className="text-xs text-rouge">{errors.guests}</div>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}

              {step === 2 ? (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
                >
                  <div className="space-y-2">
              <label className="text-xs text-gold uppercase tracking-wider font-bold">{t('name')}</label>
              <input
                ref={nameRef}
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                className={cn(
                  "w-full bg-obsidian border p-4 text-ivory outline-none transition-colors text-base",
                  errors.name ? "border-rouge/60 focus:border-rouge" : "border-white/10 focus:border-gold"
                )}
                placeholder={t('name')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "reservation-name-error" : undefined}
                autoComplete="name"
              />
              {errors.name ? (
                <div id="reservation-name-error" className="text-xs text-rouge">{errors.name}</div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gold uppercase tracking-wider font-bold">{t('phone')}</label>
              <input
                ref={phoneRef}
                type="tel"
                value={phoneDisplay}
                onChange={(e) => setField('phoneDigits', normalizeDigits(e.target.value))}
                className={cn(
                  "w-full bg-obsidian border p-4 text-ivory outline-none transition-colors font-mono text-base",
                  errors.phoneDigits ? "border-rouge/60 focus:border-rouge" : "border-white/10 focus:border-gold"
                )}
                placeholder={t('phone_placeholder')}
                inputMode="tel"
                aria-invalid={Boolean(errors.phoneDigits)}
                aria-describedby={errors.phoneDigits ? "reservation-phone-error" : undefined}
                autoComplete="tel"
              />
              {errors.phoneDigits ? (
                <div id="reservation-phone-error" className="text-xs text-rouge">{errors.phoneDigits}</div>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs text-gold uppercase tracking-wider font-bold">{t('email')}</label>
              <input
                ref={emailRef}
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className={cn(
                  "w-full bg-obsidian border p-4 text-ivory outline-none transition-colors text-base",
                  errors.email ? "border-rouge/60 focus:border-rouge" : "border-white/10 focus:border-gold"
                )}
                placeholder={t('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "reservation-email-error" : undefined}
                autoComplete="email"
              />
              {errors.email ? (
                <div id="reservation-email-error" className="text-xs text-rouge">{errors.email}</div>
              ) : null}
            </div>
                </motion.div>
              ) : null}

              {step === 3 ? (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-obsidian/40 border border-white/10 rounded-lg p-4">
                      <div className="text-[11px] text-ash uppercase tracking-widest font-mono mb-1">{t('date')}</div>
                      <div className="text-ivory text-sm font-medium">{form.date || '—'}</div>
                    </div>
                    <div className="bg-obsidian/40 border border-white/10 rounded-lg p-4">
                      <div className="text-[11px] text-ash uppercase tracking-widest font-mono mb-1">{t('time')}</div>
                      <div className="text-ivory text-sm font-medium">{form.time || '—'}</div>
                    </div>
                    <div className="bg-obsidian/40 border border-white/10 rounded-lg p-4">
                      <div className="text-[11px] text-ash uppercase tracking-widest font-mono mb-1">{t('guests')}</div>
                      <div className="text-ivory text-sm font-medium">{form.guests || '—'}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gold uppercase tracking-wider font-bold">{t('special_requests')}</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-silver" size={18} />
                      <textarea
                        ref={requestsRef}
                        rows={4}
                        value={form.requests}
                        onChange={(e) => setField('requests', e.target.value)}
                        className={cn(
                          "w-full bg-obsidian border p-4 pl-12 text-ivory outline-none transition-colors resize-none text-base",
                          errors.requests ? "border-rouge/60 focus:border-rouge" : "border-white/10 focus:border-gold"
                        )}
                        placeholder={t('special_requests')}
                        aria-invalid={Boolean(errors.requests)}
                        aria-describedby={errors.requests ? "reservation-requests-error" : undefined}
                        maxLength={320}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-ash font-mono">
                      <span>
                        {errors.requests ? (
                          <span id="reservation-requests-error" className="text-rouge">
                            {errors.requests}
                          </span>
                        ) : null}
                      </span>
                      <span>{form.requests.trim().length}/300</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center justify-between gap-3 pt-2">
                    <Button variant="secondary" onClick={goBack}>
                      {t('back')}
                    </Button>
                    <Button type="submit">{t('submit_reservation')}</Button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {step < 3 ? (
              <div className="hidden sm:flex items-center justify-between gap-3 pt-2">
                {step > 1 ? (
                  <Button variant="secondary" onClick={goBack}>
                    {t('back')}
                  </Button>
                ) : (
                  <div />
                )}
                <Button onClick={goNext}>{t('next')}</Button>
              </div>
            ) : null}

            <div className="sm:hidden sticky bottom-0 -mx-5 px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+1rem)] bg-charcoal/90 backdrop-blur-md border-t border-white/10">
              <div className="flex items-center gap-3">
                {step > 1 ? (
                  <Button variant="secondary" onClick={goBack} className="flex-1">
                    {t('back')}
                  </Button>
                ) : null}
                {step < 3 ? (
                  <Button onClick={goNext} className="flex-1">
                    {t('next')}
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1">
                    {t('submit_reservation')}
                  </Button>
                )}
              </div>
              <div className="mt-2 text-[11px] text-ash">
                {step === 1
                  ? t('reservation_desc')
                  : step === 2
                    ? `${t('phone')} • ${t('email')}`
                    : t('reservation_success_hint')}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
