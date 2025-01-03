import cn from 'classnames';
import {Loader, LucideProps} from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  let {className, disabled, loadingText, ...rest} = props;
  disabled = disabled || loading;

  const classes = cn(
    'rounded-xl transition-all flex flex-row items-center justify-center gap-2',
    {
      'border border-primary/60 bg-gradient-to-tr from-primary/10 to-primary/35 text-primary hover:to-primary/45 hover:scale-[1.018] font-medium':
        variant === 'primary' && !disabled,
      'bg-secondary-bg text-secondary border border-secondary-border hover:brightness-125 hover:scale-[1.02]':
        variant === 'secondary' && !disabled,
      'bg-secondary-bg/80 text-secondary/50 cursor-not-allowed': disabled,
      'px-3 py-2 text-sm': size === 'sm',
      'px-5 py-3 text-sm': size === 'md',
      'px-6 py-4 text-lg': size === 'lg',
    },
    className,
  );

  return (
    <button {...rest} className={classes} disabled={disabled || loading}>
      {loading && <Loader size={16} className="animate-spin" />}
      {props.icon && !loading && <props.icon size={16} />}
      {loadingText && loading ? loadingText : children}
    </button>
  );
};
