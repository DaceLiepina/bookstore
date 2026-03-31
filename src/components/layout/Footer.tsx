import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { translations } from '../../features/language/translations';

const Footer: React.FC = () => {
  const currentLanguage = useAppSelector(
    (state) => state.language.currentLanguage
  );
  const t = translations[currentLanguage].footer;

  const footerLinks = {
    [t.links.shop.title]: [
      { label: t.links.shop.allBooks, path: '/catalog' },
      { label: t.links.shop.newReleases, path: '/new' },
      { label: t.links.shop.bestsellers, path: '/bestsellers' },
    ],
    [t.links.help.title]: [
      { label: t.links.help.contactUs, path: '/contact' },
      { label: t.links.help.shipping, path: '/shipping' },
      { label: t.links.help.returns, path: '/returns' },
    ],
    [t.links.company.title]: [
      { label: t.links.company.aboutUs, path: '/about' },
      { label: t.links.company.careers, path: '/careers' },
      { label: t.links.company.privacyPolicy, path: '/privacy' },
    ],
  };

  return (
    <footer className='bg-gray-900 text-white dark:text-gray-400 border-t shadow-2xl'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo and Description */}
          <div className='md:col-span-1'>
            <h2 className='text-2xl font-bold mb-4'>BookStore</h2>
            <p className='text-gray-400'>{t.description}</p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className='font-semibold text-lg mb-4'>{category}</h3>
              <ul className='space-y-2'>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className='text-gray-400 hover:text-white transition-colors'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>
            &copy; {new Date().getFullYear()} BookStore. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
