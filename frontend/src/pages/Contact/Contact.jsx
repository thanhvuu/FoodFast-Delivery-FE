import React from 'react'
import './Contact.css'
import Footer from '../../components/Footer/Footer'
import { useLanguage } from '../../Context/LanguageContext'

const Contact = () => {
  const { dictionary } = useLanguage()
  const contactText = dictionary.contactPage

  return (
    <div className='contact-page'>
      <section className='contact-hero'>
        <div className='contact-hero-content'>
          <span className='contact-eyebrow'>{contactText.eyebrow}</span>
          <h1>{contactText.title}</h1>
          <p>{contactText.description}</p>
        </div>
      </section>

      <section className='contact-grid'>
        <div className='contact-card'>
          <h2>{contactText.infoTitle}</h2>
          <ul>
            {contactText.details.map((detail) => (
              <li key={`${detail.label}-${detail.value}`}>
                <span className='label'>{detail.label}:</span>
                {detail.href ? (
                  <a href={detail.href}>{detail.value}</a>
                ) : (
                  <span>{detail.value}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className='contact-card'>
          <h2>{contactText.formTitle}</h2>
          <form className='contact-form'>
            <label>
              {contactText.formNameLabel}
              <input type='text' name='name' placeholder={contactText.formNamePlaceholder} required />
            </label>
            <label>
              {contactText.formEmailLabel}
              <input type='email' name='email' placeholder={contactText.formEmailPlaceholder} required />
            </label>
            <label>
              {contactText.formMessageLabel}
              <textarea name='message' rows='4' placeholder={contactText.formMessagePlaceholder} required />
            </label>
            <button type='submit'>{contactText.formSubmit}</button>
          </form>
        </div>
      </section>

      <section className='contact-map'>
        <iframe
          title={contactText.mapTitle}
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4596657716604!2d106.7004233760292!3d10.776889459259585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4099d6b67d%3A0xa3b0b78f0a6181d!2zMzYgTmd1eeG7hW4gxJBp4buHbiBWxINuIENo4bunIE1pbmgsIFBoxrDhu51uZyAxLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIMSQ4buLbmcsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1708575150833!5m2!1sen!2s'
          loading='lazy'
          allowFullScreen
          referrerPolicy='no-referrer-when-downgrade'
        ></iframe>
      </section>
    </div>
  )
}

export default Contact
