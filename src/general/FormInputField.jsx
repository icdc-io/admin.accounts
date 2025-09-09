import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { Input } from "container/Input";
import Popup from "container/Popup";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatI18nMessageToObject } from "./formatErrorMessages";

export const InputFormField = ({ fieldInfo, form }) => {
	const { t } = useTranslation();

	const rules = fieldInfo.rules || {};

	return (
		<FormField
			key={fieldInfo.name}
			control={form.control}
			name={fieldInfo.name}
			rules={rules}
			render={({ field }) => {
				const { error } = form.getFieldState(fieldInfo.name);
				const [key, options] = formatI18nMessageToObject(error?.message);
				return (
					<FormItem className={"general-input"}>
						<FormLabel className="flex items-center">
							<b>{t(fieldInfo.label)}</b>
							&nbsp;
							{fieldInfo.clarification && (
								<Popup content={t(fieldInfo.clarification)}>
									<button type="button">
										<CircleHelp size={16} />
									</button>
								</Popup>
							)}
						</FormLabel>
						<FormControl>
							<Input
								placeholder={t(fieldInfo.placeholder)}
								{...field}
								onChange={(e) => {
									console.log(e.target.value);
									field.onChange(e.target.value);
									fieldInfo.onChange?.(e.target.value);
								}}
								value={String(field.value)}
								disabled={fieldInfo.disabled}
								maxLength={rules.maxLength}
							/>
						</FormControl>
						{key && <FormMessage>{t(key, options)}</FormMessage>}
						{fieldInfo.description && (
							<FormDescription>{t(fieldInfo.description)}</FormDescription>
						)}
					</FormItem>
				);
			}}
		/>
	);
};
