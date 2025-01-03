import type {CollectionFilterFragment} from 'storefrontapi.generated';
import * as React from 'react';
import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import cn from 'classnames';
import {X} from 'lucide-react';
import {Button} from '~/components/input';
import {useLocation, useNavigate} from '@remix-run/react';

type FilterModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  setActiveFilters: (count: number) => void;
} & CollectionFilterFragment;

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  filters,
  closeModal: closeModalExternal,
  setActiveFilters,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);

  const forceCurrentState = () => {
    const currentParams = new URLSearchParams(location.search);
    const filterParams = currentParams.getAll('filters');
    setSelectedFilters(filterParams);
  };

  const closeModal = (excludeForce = false) => {
    if (!excludeForce) {
      forceCurrentState();
    }
    closeModalExternal();
  };

  const handleToggleFilter = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleApplyFilter = (clear = false) => {
    const currentParams = new URLSearchParams(location.search);

    if (clear || selectedFilters.length === 0) {
      currentParams.delete('filters');
    } else {
      selectedFilters.forEach((filter, i) => {
        if (i == 0) {
          currentParams.set('filters', filter);
        } else {
          currentParams.append('filters', filter);
        }
      });
    }

    navigate(`${location.pathname}?${currentParams.toString()}`, {
      replace: true,
      preventScrollReset: true,
    });

    if (!clear) {
      closeModal(true);
    }
  };

  const clearFilter = () => {
    setSelectedFilters([]);
    handleApplyFilter(true);
  };

  React.useEffect(() => {
    setActiveFilters(selectedFilters.length);
  }, [selectedFilters, setActiveFilters]);

  React.useEffect(() => {
    forceCurrentState();
  }, []);

  return (
    <Dialog open={isOpen} onClose={closeModal} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center text-center">
          <DialogPanel
            transition
            className="flex w-full md:max-w-2xl transform flex-col gap-4 overflow-hidden rounded-2xl text-secondary bg-secondary-bg border border-secondary-border py-4 text-left align-middle shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="border-b border-secondary-border w-full grid grid-cols-3 pb-3 px-8">
              <div className="cursor-pointer flex box-content w-fit items-center p-[7px] rounded-full border border-transparent hover:border-black-60/50 transition-colors">
                <X className="text-lg" onClick={() => closeModal()} />
              </div>
              <p className="font-semibold w-full flex justify-center items-center text-primary">
                Products Filter
              </p>
            </div>
            <div className="max-h-96 flex flex-col gap-8 overflow-y-scroll px-8">
              {filters.map((filter) => (
                <FilterSection
                  key={filter.id}
                  filter={filter}
                  selectedFilters={selectedFilters}
                  handleToggleFilter={handleToggleFilter}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 justify-between border-t border-secondary-border pt-6 mb-2 px-8">
              <Button variant="secondary" onClick={clearFilter}>
                Clear Filters
              </Button>
              <Button variant="primary" onClick={() => handleApplyFilter()}>
                Show Products
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

const FilterSection: React.FC<{
  filter: CollectionFilterFragment['filters'][number];
  selectedFilters: string[];
  handleToggleFilter: (filter: string) => void;
}> = ({filter, selectedFilters, handleToggleFilter}) => {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="leading-none text-lg font-medium text-primary">
        {filter.label}
      </h2>
      <div className="flex flex-wrap gap-2">
        {filter.values.map((value) => {
          const active = selectedFilters.includes(value.input as string);

          return (
            <button
              key={value.id}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 border hover:brightness-125 cursor-pointer',
                {
                  'border-primary text-primary font-bold bg-primary-bg': active,
                  'border-secondary-border bg-secondary-bg text-secondary':
                    !active,
                },
              )}
              onClick={() => handleToggleFilter(value.input as string)}
            >
              {active && <span className="h-2 w-2 bg-primary rounded-full" />}
              <span>
                {value.label} ({value.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
