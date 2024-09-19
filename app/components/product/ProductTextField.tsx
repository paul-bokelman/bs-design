import React from 'react';
import {type TextFieldProps, TextField} from '~/components/input';

interface ProductTextFieldProps extends TextFieldProps {}

export const ProductTextField: React.FC<ProductTextFieldProps> = ({
  placeholder = 'Personalized message',
  ...props
}) => {
  return <TextField placeholder={placeholder} {...props} />;
};
