import cn from 'classnames';
import {LoaderCircle} from 'lucide-react';

interface Props {
  active: boolean;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Pill: React.FC<Props> = ({active, label, disabled, onClick}) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        `inline-flex items-center gap-2 px-6 py-2 rounded-full cursor-pointer border text-sm`,
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
