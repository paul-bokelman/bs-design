import React from 'react';
import type {CollectionFilterFragment} from 'storefrontapi.generated';
import {useLocation, useNavigate} from '@remix-run/react';
import {Button} from '~/components/input';
import {Filter} from 'lucide-react';
import {FilterModal} from '~/components/modals';

type ProductsFilterProps = CollectionFilterFragment;

export const ProductsFilter: React.FC<ProductsFilterProps> = ({filters}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showFiltersModal, setShowFiltersModal] = React.useState(false);

  // const handleSelection = (title: string) => {
  //   setIsLoading(true);
  //   if (selectedTypes.includes(title)) {
  //     setSelectedTypes(selectedTypes.filter((item) => item !== title));
  //   } else {
  //     setSelectedTypes([...selectedTypes, title]);
  //   }
  // };

  // React.useEffect(() => {
  //   const currentParams = new URLSearchParams(location.search);

  //   if (selectedTypes.length === 0) {
  //     currentParams.delete('types');
  //   } else {
  //     currentParams.set('types', selectedTypes[0]);
  //     for (let i = selectedTypes.length - 1; i > 0; i--) {
  //       currentParams.append('types', selectedTypes[i]);
  //     }
  //   }

  //   navigate(`${location.pathname}?${currentParams.toString()}`, {
  //     replace: true,
  //     preventScrollReset: true,
  //   });

  //   setIsLoading(false);
  // }, [selectedTypes]);

  // React.useEffect(() => {
  //   const params = new URLSearchParams(location.search);
  //   const types = params.getAll('types');
  //   if (types) {
  //     setSelectedTypes(types);
  //   }
  // }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          icon={Filter}
          variant="secondary"
          loading={isLoading}
          onClick={() => setShowFiltersModal(true)}
        >
          Filters
        </Button>
      </div>
      <FilterModal
        isOpen={showFiltersModal}
        filters={filters}
        closeModal={() => setShowFiltersModal(false)}
      />
    </>
  );
};
