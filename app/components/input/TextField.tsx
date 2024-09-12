export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

export const TextField: React.FC<TextFieldProps> = ({ label, ...props }) => {
    return (
        <div>
            <label>{label}</label>
            <input {...props} />
        </div>
    )
}