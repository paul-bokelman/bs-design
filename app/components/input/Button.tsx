import cn from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  const {className, disabled, ...rest} = props;
  const classes = cn(
    'px-5 py-3 bg-primary text-black rounded-lg text-md font-medium hover:bg-primary/90 hover:scale-[1.02] transition-all',
    className,
  );
  return (
    <button {...rest} className={classes} disabled={disabled}>
      {children}
    </button>
  );
};
