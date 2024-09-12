import React from 'react';
import cn from 'classnames';
import {Await, NavLink} from '@remix-run/react';
import {type CartViewPayload, useAnalytics} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/layout';
import {MenuIcon, Search, ShoppingCart, X} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';


export function Header({header, cart, publicStoreDomain}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="bg-gradient-to-b from-black to-black/80 flex items-center px-12 py-6 sticky top-0 z-[3] h-full rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-filter backdrop-blur-[6px]">
      <NavLink prefetch="intent" to="/" className={activeLinkStyle} end>
        <img src="bs-logo.png" alt="BS Logo" height={50} width={50} />
      </NavLink>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
      <HeaderCtas cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  // const displayedMenu = menu || FALLBACK_HEADER_MENU; // todo: change back when we have a proper menu
  const displayedMenu = FALLBACK_HEADER_MENU; // todo: change back when we have a proper menu

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          className={activeLinkStyle}
          onClick={closeAside}
          prefetch="intent"
          to="/"
        >
          Home
        </NavLink>
      )}
      {displayedMenu.items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            className='cursor-pointer text-secondary hover:text-primary hover:scale-[1.02] transition-all'
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <SearchToggle />
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? 'auto' : 'hidden';
  }

  return (
    <>
    {isOpen && (
        <div className='fixed inset-0 w-screen h-screen bg-black/95 z-[30] shadow-[0_4px_30px_rgba(0,0,0,0.1)] backdrop-filter backdrop-blur-[30px]'>
          <div className='relative w-full h-full px-12 py-6'>
            <div className='w-full flex justify-between'>
              <NavLink prefetch="intent" to="/" end>
                <img src="bs-logo.png" alt="BS Logo" height={50} width={50} />
              </NavLink>
              <X className='text-secondary cursor-pointer hover:text-primary hover:scale-110 transition-all' size={28} onClick={handleClick} />
            </div> 
          <div className='mt-12 w-full min-h-64 max-h-[calc(100%-15rem)] flex flex-col items-center justify-center'>
            <div className='flex flex-col items-start gap-8'>
              {[{title: 'Products', url: '/products', active: true}, {title: 'Cart', url: '/cart', active: false}, {title: 'Search', url: '/search', active: false}].map((item) => (
                  <NavLink
                    className={cn('cursor-pointer hover:text-primary hover:scale-[1.02] hover:font-bold transition-all text-5xl', {
                      'text-primary font-bold': item.active,
                      'text-secondary font-semibold': !item.active,
                    })}
                    end
                    prefetch="intent"
                    to={item.url}
                    onClick={handleClick}
                  >
                    {item.title}
                  </NavLink>
              ))}
            </div>
          </div>
        </div>
    </div>
    )}
    <button
      className="header-menu-mobile-toggle reset"
      onClick={handleClick}
    >
      <MenuIcon className="text-secondary cursor-pointer hover:text-primary hover:scale-110 transition-all" size={28} />
    </button>
    </>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <Search className="text-secondary cursor-pointer hover:text-primary hover:scale-110 transition-all" size={28} onClick={() => open('search')} />
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="relative"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <ShoppingCart className="relative text-secondary hover:text-primary hover:scale-110 transition-all" size={28} />
      <div className="absolute top-0 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-400 flex items-center justify-center">
        <span className="text-xs text-black">{count}</span>
      </div>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <React.Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </React.Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Products',
      type: 'HTTP',
      url: '/products',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return cn('cursor-pointer text-secondary', {
    'text-primary': isActive,
    'text-primary-faded': isPending,
  });
}
