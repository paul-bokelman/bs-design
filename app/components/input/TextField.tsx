import React from 'react';

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  required = false,
  ...props
}) => {
  return (
    <div className="flex flex-col max-w-[30rem]">
      {label && (
        <div className="flex flex-row gap-1">
          <label className="text-secondary text-sm">{label}</label>
          {required && <span className="text-red-500">*</span>}
        </div>
      )}
      <input
        className="border border-secondary-faded rounded-lg bg-secondary/10 px-4 py-2 text-primary placeholder:text-secondary-faded"
        {...props}
      />
    </div>
  );
};
