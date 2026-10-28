import { useRef, useState } from 'react';
import { ArrowUpRight, Check, LoaderCircle, Instagram, Youtube } from 'lucide-react';
import { PageIntro, Button, Eyebrow, Picture } from '../components/common/UI';
import { submitBooking, apiMessage } from '../services/api';
import { eventTypes, socialLinks, todayInIndia } from '../utils/site';
const initial = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  city: '',
  venue: '',
  expectedAudience: '',
  message: '',
};
export default function Contact() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [failure, setFailure] = useState('');
  const [reference, setReference] = useState('');
  const requestId = useRef(crypto.randomUUID());
  const busy = useRef(false);
  const formRef = useRef(null);
  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setErrors((current) => ({ ...current, [event.target.name]: '' }));
    if (status !== 'sending') {
      requestId.current = crypto.randomUUID();
      setFailure('');
    }
  }
  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    const next = {};
    if (values.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      next.email = 'Please enter a valid email address.';
    if (
      !/^\+?[\d ()-]+$/.test(values.phone) ||
      values.phone.replace(/\D/g, '').length < 7 ||
      values.phone.replace(/\D/g, '').length > 15
    )
      next.phone = 'Please use a phone number with 7 to 15 digits.';
    if (!values.eventType) next.eventType = 'Choose the type of event.';
    if (!values.eventDate || values.eventDate < todayInIndia())
      next.eventDate = 'Choose today or a future date.';
    if (values.city.trim().length < 2) next.city = 'Please enter the event city.';
    if (values.message.trim().length < 10)
      next.message = 'Tell us a little more (at least 10 characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => formRef.current.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    busy.current = true;
    setStatus('sending');
    setFailure('');
    try {
      const payload = {
        ...values,
        ...(values.expectedAudience ? { expectedAudience: Number(values.expectedAudience) } : {}),
      };
      if (!values.expectedAudience) delete payload.expectedAudience;
      const response = await submitBooking(payload, requestId.current);
      if (!response.data.success || !response.data.data.reference)
        throw new Error('Booking was not confirmed.');
      setReference(response.data.data.reference);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setFailure(apiMessage(error));
      setErrors(error.response?.data?.error?.fields || {});
    } finally {
      busy.current = false;
    }
  }
  const field = (name, label, type = 'text', required = true, extra = {}) => (
    <div className={`form-field ${name === 'message' ? 'full-width' : ''}`}>
      <label htmlFor={name}>
        {label}
        {!required && <span> (optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={values[name]}
        onChange={update}
        required={required}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...extra}
      />
      {errors[name] && (
        <span className="field-error" id={`${name}-error`}>
          {errors[name]}
        </span>
      )}
    </div>
  );
  return (
    <>
      <PageIntro
        eyebrow="BOOKINGS & COLLABORATIONS"
        title={
          <>
            Let’s create something
            <br />
            <em>memorable.</em>
          </>
        }
      >
        A concert, a celebration, or a new creative connection. Tell us what you have in mind.
      </PageIntro>
      <section className="container contact-layout">
        <aside className="contact-aside">
          <div className="contact-photo">
            <Picture
              src="/images/C-CD--102-.jpeg"
              alt="Avinash Gupta at a microphone with his arms raised on stage"
              width={666}
              height={1332}
            />
          </div>
          <Eyebrow>BRING THE MUSIC TO YOUR MOMENT</Eyebrow>
          <p>
            For live performances, corporate gatherings, private events, and professional
            collaborations.
          </p>
          <div className="contact-socials">
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <Instagram size={17} />
              Instagram
              <ArrowUpRight size={14} />
            </a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
              <Youtube size={17} />
              YouTube
              <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>
        <div className="booking-form-panel">
          {status === 'success' ? (
            <div className="booking-success" role="status">
              <span className="success-check">
                <Check size={28} />
              </span>
              <Eyebrow>YOUR NEXT MOMENT STARTS HERE</Eyebrow>
              <h2>
                Thank you
                <br />
                <em>for reaching out.</em>
              </h2>
              <p>
                Your enquiry has been received. Your details will be used to respond to your
                request.
              </p>
              <small>Enquiry reference: {reference}</small>
              <Button
                variant="outline"
                onClick={() => {
                  setStatus('idle');
                  setValues(initial);
                  requestId.current = crypto.randomUUID();
                }}
              >
                Send another enquiry
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate ref={formRef}>
              <div className="form-heading">
                <h2>A little about your event.</h2>
                <p>All fields are required unless marked optional.</p>
              </div>
              <fieldset disabled={status === 'sending'} className="form-grid">
                {field('name', 'Full name', 'text', true, {
                  autoComplete: 'name',
                  maxLength: 120,
                  placeholder: 'Your name',
                })}
                {field('email', 'Email address', 'email', true, {
                  autoComplete: 'email',
                  maxLength: 254,
                  placeholder: 'you@example.com',
                })}
                {field('phone', 'Phone number', 'tel', true, {
                  autoComplete: 'tel',
                  maxLength: 30,
                  placeholder: '+91',
                })}
                <div className="form-field">
                  <label htmlFor="eventType">Event type</label>
                  <select
                    id="eventType"
                    name="eventType"
                    value={values.eventType}
                    onChange={update}
                    required
                    aria-invalid={!!errors.eventType}
                    aria-describedby={errors.eventType ? 'eventType-error' : undefined}
                  >
                    <option value="">Select an event type</option>
                    {eventTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                  {errors.eventType && (
                    <span id="eventType-error" className="field-error">
                      {errors.eventType}
                    </span>
                  )}
                </div>
                {field('eventDate', 'Event date', 'date', true, { min: todayInIndia() })}
                {field('city', 'City', 'text', true, {
                  maxLength: 120,
                  placeholder: 'Where will we meet?',
                })}
                {field('venue', 'Venue', 'text', false, {
                  maxLength: 200,
                  placeholder: 'Venue name, if known',
                })}
                {field('expectedAudience', 'Expected audience', 'number', false, {
                  min: 1,
                  max: 1000000,
                  placeholder: 'Approximate number of guests',
                })}
                <div className="form-field full-width">
                  <label htmlFor="message">Tell us about your event</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={3000}
                    value={values.message}
                    onChange={update}
                    required
                    placeholder="The occasion, the atmosphere, the music you love…"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <span className="field-error" id="message-error">
                      {errors.message}
                    </span>
                  )}
                </div>
              </fieldset>
              {failure && (
                <p className="form-error" role="alert">
                  {failure}
                </p>
              )}
              <p className="privacy-note">
                Your details are used only to respond to this enquiry and coordinate your event.
                Submitting an enquiry does not confirm a booking.
              </p>
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <>
                    <LoaderCircle className="spin" size={17} />
                    Sending your enquiry…
                  </>
                ) : (
                  <>
                    Send booking enquiry
                    <ArrowUpRight size={17} />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
