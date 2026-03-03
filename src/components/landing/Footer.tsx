import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, ExternalLink } from 'lucide-react';
import { RESTAURANT_INFO } from '@/lib/data/restaurant-data';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-charcoal border-t border-white/5 pt-20 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] text-silver">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="font-display italic text-4xl text-gold">{RESTAURANT_INFO.name}</Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {t('restaurant_slogan')}.<br/>
              {t('footer_desc')}
            </p>
            <div className="flex gap-4 mt-2">
              <a href={RESTAURANT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><Instagram size={20} /></a>
              <a href={RESTAURANT_INFO.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><Facebook size={20} /></a>
              <a href={RESTAURANT_INFO.socials.tripadvisor} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><ExternalLink size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-6">{t('quick_links')}</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-ivory transition-colors">{t('home')}</Link></li>
              <li><Link to="/menu" className="hover:text-ivory transition-colors">{t('menu')}</Link></li>
              <li><a href="#about" className="hover:text-ivory transition-colors">{t('about')}</a></li>
              <li><a href="#reservation" className="hover:text-ivory transition-colors">{t('reservation')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-6">{t('contact')}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li><a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-ivory transition-colors">{RESTAURANT_INFO.phone}</a></li>
              <li><a href={`mailto:${RESTAURANT_INFO.email}`} className="hover:text-ivory transition-colors">{RESTAURANT_INFO.email}</a></li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-accent text-gold text-sm tracking-widest uppercase mb-6">{t('working_hours')}</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-ivory">{t('opening_hours')}</li>
              <li className="flex justify-between">
                <span>{t('follow_us')}</span>
                <div className="flex gap-2">
                  <a href={RESTAURANT_INFO.socials.instagram} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><Instagram size={16} /></a>
                  <a href={RESTAURANT_INFO.socials.facebook} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors"><Facebook size={16} /></a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ash">
          <p>© 2024 {RESTAURANT_INFO.name}. {t('rights_reserved')}</p>
          <div className="flex items-center gap-2">
            <span>{t('powered_by')}</span>
            <a href="#" className="text-silver hover:text-gold transition-colors font-medium">{t('qr_menu_system')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
