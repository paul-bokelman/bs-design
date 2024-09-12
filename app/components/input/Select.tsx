export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
}

export const Select: React.FC<SelectProps> = ({ label, ...props }) => {
    return (
        <div>
            <label>{label}</label>
            <select {...props} />
        </div>
    )
}