import cn from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  size = 'md',
  ...props
}) => {
  const {className, disabled, ...rest} = props;
  const classes = cn(
    'bg-primary text-black rounded-lg font-medium hover:bg-primary/90 hover:scale-[1.02] transition-all',
    {
      'px-3 py-2 text-sm': size === 'sm',
      'px-5 py-3 text-md': size === 'md',
      'px-6 py-4 text-lg': size === 'lg',
      'bg-secondary-faded text-secondary hover:bg-secondary-faded cursor-not-allowed hover:scale-100':
        disabled,
    },
    className,
  );
  return (
    <button {...rest} className={classes} disabled={disabled}>
      {children}
    </button>
  );
};
