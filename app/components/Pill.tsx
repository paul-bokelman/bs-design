import cn from 'classnames';

interface Props {
  active: boolean;
  label: string;
  onClick?: () => void;
}

export const Pill: React.FC<Props> = ({active, label, onClick}) => {
  return (
    <button
      className={cn(
        `inline-flex items-center px-6 py-2 rounded-full cursor-pointer border text-sm`,
        {
          'bg-primary text-black border-primary font-semibold': active,
          'bg-secondary-bg text-secondary border-secondary': !active,
        },
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
