import React from 'react';
import type {CollectionFilterFragment} from 'storefrontapi.generated';
import {Button} from '~/components/input';
import {Filter} from 'lucide-react';
import {FilterModal} from '~/components/modals';

type ProductsFilterProps = CollectionFilterFragment & {disabled?: boolean};

export const ProductsFilter: React.FC<ProductsFilterProps> = ({
  disabled,
  filters,
}) => {
  const [showFiltersModal, setShowFiltersModal] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<number>(0);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Button
            icon={Filter}
            variant="secondary"
            disabled={disabled}
            onClick={() => setShowFiltersModal(true)}
          >
            Filters
          </Button>
          {activeFilters > 0 && (
            <div className="absolute flex justify-center items-center -top-1 -right-1 bg-primary h-4 w-4 rounded-full">
              <span className="text-black text-xs">{activeFilters}</span>
            </div>
          )}
        </div>
      </div>
      <FilterModal
        isOpen={showFiltersModal}
        setActiveFilters={setActiveFilters}
        filters={filters}
        closeModal={() => setShowFiltersModal(false)}
      />
    </>
  );
};
