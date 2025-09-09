import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "container/Form";
import { Label } from "container/Label";
import { RadioGroup, RadioGroupItem } from "container/Radio";
import { useTranslation } from "react-i18next";

export const RadioFormField = ({ fieldInfo, form }) => {
	const { t } = useTranslation();

	return (
		<FormField
			key={fieldInfo.name}
			control={form.control}
			name={fieldInfo.name}
			rules={fieldInfo.rules}
			render={({ field }) => {
				const { error } = form.getFieldState(fieldInfo.name);
				return (
					<FormItem className="radio-field">
						<FormLabel>
							<b>{t(fieldInfo.label)}</b>
						</FormLabel>
						{fieldInfo.description && (
							<FormDescription>{t(fieldInfo.description)}</FormDescription>
						)}
						<FormControl>
							<RadioGroup
								onValueChange={field.onChange}
								defaultValue={field.value}
								className="flex radio-group gap-4"
							>
								{fieldInfo.options.map((item) => (
									<div
										className="flex flex-row items-center space-x-3 space-y-0 gap-2"
										key={item.value}
									>
										<RadioGroupItem value={item.value} />
										<Label className="font-normal">{t(item.text)}</Label>
									</div>
								))}
							</RadioGroup>
						</FormControl>
						{error?.message && <FormMessage>{t(error.message)}</FormMessage>}
					</FormItem>
				);
			}}
		/>
	);
};
