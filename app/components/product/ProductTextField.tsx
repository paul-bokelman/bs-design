import { type TextFieldProps, TextField } from "~/components/input"

interface ProductTextFieldProps extends TextFieldProps {}

export const ProductTextField: React.FC<ProductTextFieldProps> = ({ label, ...props }) => {
    return <TextField label={label} {...props} />
}