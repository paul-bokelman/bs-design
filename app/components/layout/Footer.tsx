import {Suspense} from 'react';
import {Await, NavLink} from '@remix-run/react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import logo from '~/assets/bs-logo.png';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer>
            {footer?.menu && header.shop.primaryDomain?.url && (
              <FooterMenu
                menu={footer.menu}
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav
      className="flex items-center justify-center px-4 lg:px-12 h-mobile-footer lg:h-footer bg-black"
      role="navigation"
    >
      <div className="flex flex-col lg:flex-row w-full justify-between">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 mb-4 lg:mb-0">
          <img
            src={logo}
            alt="BS Logo"
            height={40}
            width={40}
            className="mb-2 lg:mb-0 lg:mr-4"
          />
          <div className="flex flex-row items-center justify-center lg:items-start gap-2">
            <span className="text-sm text-secondary">
              bsdesignsmtnhome@gmail.com
            </span>
            <span className="text-sm text-secondary">•</span>
            <span className="text-sm text-secondary">208-590-8285</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-6">
          {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
            if (!item.url) return null;
            // if the url is internal, we strip the domain
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
                ? new URL(item.url).pathname
                : item.url;
            const isExternal = !url.startsWith('/');
            return isExternal ? (
              <a
                href={url}
                key={item.id}
                rel="noopener noreferrer"
                target="_blank"
                className="text-sm text-secondary hover:text-primary hover:scale-[1.02] transition-all"
              >
                {item.title}
              </a>
            ) : (
              <NavLink
                end
                className="text-sm text-secondary hover:text-primary hover:scale-[1.02] transition-all"
                key={item.id}
                prefetch="intent"
                to={url}
              >
                {item.title}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
