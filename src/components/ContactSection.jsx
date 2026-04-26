import { useTranslation } from 'react-i18next'
import './ContactSection.css'

export default function ContactSection() {
  const { t } = useTranslation()

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <h2 className="contact__heading">
          {t('contact.heading1')} <em>{t('contact.heading2')}</em>
        </h2>
        <p className="contact__para">{t('contact.para')}</p>
        <div className="contact__buttons">
          <a className="contact__btn" href="mailto:hello@mikelsaez.com">
            {t('contact.email')}
          </a>
          <a className="contact__btn" href="https://www.linkedin.com/in/mikelvicuna/" target="_blank" rel="noopener noreferrer">
            {t('contact.linkedin')}
          </a>
        </div>
      </div>
      <footer className="contact__footer">
        <p>{t('contact.footer')}</p>
      </footer>
    </section>
  )
}
