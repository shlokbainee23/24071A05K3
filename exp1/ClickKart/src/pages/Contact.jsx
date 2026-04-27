import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => {
      setForm({ name: '', email: '', subject: '', message: '' });
      setSent(false);
    }, 3000);
  }

  return (
    <div className="page">
      <section className="page__head">
        <span className="hero__eyebrow">We'd love to hear from you</span>
        <h1 className="page__title">Contact ClickKart</h1>
        <p className="page__subtitle">
          Questions, feedback, or partnership ideas — drop us a note and we'll be in touch.
        </p>
      </section>

      <section className="contact-layout">
        <aside className="panel contact-info">
          <h2 className="panel__title">Get in touch</h2>
          <ul className="contact-list">
            <li>
              <span className="contact-list__icon" aria-hidden="true">📍</span>
              <div>
                <strong>Address</strong>
                <p>Hyderabad, Telangana, India</p>
              </div>
            </li>
            <li>
              <span className="contact-list__icon" aria-hidden="true">📞</span>
              <div>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
            </li>
            <li>
              <span className="contact-list__icon" aria-hidden="true">✉️</span>
              <div>
                <strong>Email</strong>
                <p>support@clickkart.in</p>
              </div>
            </li>
            <li>
              <span className="contact-list__icon" aria-hidden="true">🕒</span>
              <div>
                <strong>Hours</strong>
                <p>Mon – Sat · 9:00 AM to 8:00 PM IST</p>
              </div>
            </li>
          </ul>
        </aside>

        <form className="panel" onSubmit={handleSubmit} noValidate>
          <h2 className="panel__title">Send us a message</h2>

          {sent && (
            <div className="alert alert--success" role="status">
              ✓ Message Sent! We'll respond shortly.
            </div>
          )}

          <div className="field-row">
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input
                id="c-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="c-subject">Subject</label>
            <input
              id="c-subject"
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn--primary btn--lg">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
