import React from 'react';

interface ProductFileUploadProps {
  label?: string;
  onChange?: (file: File | null) => void;
}

export const ProductFileUpload: React.FC<ProductFileUploadProps> = ({
  label,
  onChange,
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (onChange) {
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-secondary text-sm">{label}</label>}
      <input
        type="file"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
      />
    </div>
  );
};
