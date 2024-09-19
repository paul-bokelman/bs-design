import {createContext, type ReactNode, useContext, useState} from 'react';
import cn from 'classnames';
import {X} from 'lucide-react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  return (
    <div
      aria-modal
      className={cn(
        'fixed inset-0 z-[50] bg-black bg-opacity-20 transition-opacity duration-400 ease-in-out',
        {
          'opacity-100 pointer-events-auto visible': expanded,
          'opacity-0 pointer-events-none invisible': !expanded,
        },
      )}
      role="dialog"
    >
      <button
        className="absolute inset-0 w-[calc(100%-var(--aside-width))] bg-transparent border-none text-transparent"
        onClick={close}
      />
      <aside
        className={cn(
          'bg-black/60 backdrop-blur-xl border-l border-secondary/30 rounded-l-xl shadow-[0_0_50px_rgba(0,0,0,0.3)] h-screen max-w-[var(--aside-width)] min-w-[var(--aside-width)] fixed top-0 right-[calc(-1*var(--aside-width))] transition-transform duration-200 ease-in-out',
          {
            'translate-x-[calc(var(--aside-width)*-1)]': expanded,
          },
        )}
      >
        <header className="flex items-center justify-between h-[var(--header-height)] border-b border-[var(--color-dark)] px-5">
          <h3 className="m-0 text-secondary">{heading}</h3>
          <X
            className="text-secondary/80 cursor-pointer hover:text-primary hover:scale-[1.02] transition-all"
            onClick={close}
            size={20}
          />
        </header>
        <main className="mt-2 h-[calc(100%-var(--header-height))]">
          {children}
        </main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
