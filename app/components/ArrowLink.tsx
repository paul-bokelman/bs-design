import React from 'react';
import {Link} from '@remix-run/react';
import cn from 'classnames';
import {ArrowRight} from 'lucide-react';

interface ArrowLinkProps {
  key?: string | number | null;
  className?: string;
  children: React.ReactNode;
  to: string;
}

export const ArrowLink: React.FC<ArrowLinkProps> = ({
  key,
  to,
  className,
  children,
}) => {
  const classes = cn(
    'group flex flex-row items-center gap-1 text-secondary hover:text-primary transition-colors',
    className,
  );
  return (
    <Link key={key} to={to} className={classes}>
      <span>{children}</span>
      <ArrowRight
        className="transform group-hover:translate-x-1 transition-transform"
        size={18}
      />
    </Link>
  );
};
