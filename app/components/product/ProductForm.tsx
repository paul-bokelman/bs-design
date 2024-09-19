import React from 'react';
import {VariantSelector} from '@shopify/hydrogen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/layout';
import {
  ProductSelect,
  ProductTextField,
  ProductFileUpload,
} from '~/components/product';

interface CustomAttribute {
  key: string;
  value: string;
  optional: boolean;
}

export function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  const {open} = useAside();

  const avaliableCustomAttributes = {
    message: 'TEXT',
  };

  const [attributes, setAttributes] = React.useState<Array<CustomAttribute>>(
    [],
  );

  React.useEffect(() => {
    let customAttributes: Array<CustomAttribute> = [];
    const tempOptions = product.options;

    // find and extract custom attributes
    for (const attribute of tempOptions.filter(
      (option) => option.name in avaliableCustomAttributes,
    )) {
      let attributeValue = attribute.values[0];

      // attribute matches custom attribute -> add to list and render
      if (
        attributeValue.replace('OPTIONAL_', '') ===
        avaliableCustomAttributes[
          attribute.name as keyof typeof avaliableCustomAttributes
        ]
      ) {
        customAttributes.push({
          key: attribute.name,
          value: '',
          optional: attributeValue.includes('OPTIONAL_'),
        });
      }
    }

    setAttributes(customAttributes);
  }, [product.options]);

  const handleCustomAttributeChange = (key: string, value: string) => {
    setAttributes((prev) => {
      return prev.map((attr) => {
        if (attr.key === key) {
          return {...attr, value};
        }
        return attr;
      });
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-4 h-full justify-between">
      <div className="flex flex-col gap-4">
        <VariantSelector
          handle={product.handle}
          options={product.options.filter((option) => option.values.length > 1)}
          variants={variants}
        >
          {({option}) => <ProductSelect key={option.name} option={option} />}
        </VariantSelector>
        {attributes.map((attribute) => {
          if (attribute.key === 'message') {
            return (
              <ProductTextField
                label="Message"
                value={attribute.value}
                required={!attribute.optional}
                onChange={(event) => {
                  handleCustomAttributeChange(
                    attribute.key,
                    event.target.value,
                  );
                }}
              />
            );
          } else if (attribute.key === 'file') {
            return <ProductFileUpload />;
          }
        })}
      </div>
      <AddToCartButton
        disabled={
          !selectedVariant ||
          !selectedVariant.availableForSale ||
          attributes.some(
            (attribute) => !attribute.optional && attribute.value === '',
          )
        }
        onClick={() => open('cart')}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                  attributes:
                    attributes.length > 0
                      ? attributes.map((attribute) => ({
                          key: attribute.key,
                          value: attribute.value,
                        }))
                      : undefined,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}
