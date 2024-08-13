import {useController, UseControllerProps} from "react-hook-form";
import {Label, TextInput} from "flowbite-react";

type Props = {
    label: string;
    type?: string;
    showLabel?: boolean;
} & UseControllerProps

export default function Input(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: ''})
    return (
        <div className='mb-3'>
            {props.showLabel && (
                <div className='mb-2 block'>
                    <Label htmlFor={field.name} value={props.label} />
                </div>
            )}
            <TextInput
                {...props}
                {...field}
                type={props.type || 'text'}
                placeholder={props.label}
                color={fieldState?.error ? 'failure' : !fieldState.isDirty ? '' : 'success'}
                helperText={fieldState.error?.message}
            />
        </div>
    );
}