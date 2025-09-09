import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { useTranslation } from "react-i18next";
import { SelectField } from "./SelectField";

export const SelectFormField = ({ fieldInfo, form }) => {
	const { t } = useTranslation();

	if (form.getValues(form.name) && !fieldInfo.options) return null;

	return (
		<FormField
			key={fieldInfo.name}
			control={form.control}
			name={fieldInfo.name}
			rules={fieldInfo.rules}
			render={({ field }) => {
				const { error } = form.getFieldState(fieldInfo.name);
				const onChange = (value) => {
					field.onChange(value);
					fieldInfo.onChange?.(value);
				};
				return (
					<FormItem className={"general-input"}>
						<FormLabel>
							<b>{t(fieldInfo.label)}</b>
						</FormLabel>
						<FormControl>
							<SelectField
								value={field.value}
								onChange={onChange}
								options={fieldInfo.options}
								disabled={fieldInfo.disabled}
								placeholder={fieldInfo.placeholder}
							/>
						</FormControl>

						{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
						{fieldInfo.description && (
							<FormDescription>{t(fieldInfo.description)}</FormDescription>
						)}
					</FormItem>
				);
			}}
		/>
	);
};
