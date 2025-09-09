import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "container/Select";
import { useTranslation } from "react-i18next";

export const SelectField = ({
	value,
	onChange,
	options,
	disabled,
	placeholder,
	isLoading,
}) => {
	const { t } = useTranslation();

	return (
		<Select onValueChange={onChange} value={value} disabled={disabled}>
			<SelectTrigger isLoading={isLoading}>
				<SelectValue placeholder={t(placeholder)} />
			</SelectTrigger>
			<SelectContent>
				{options?.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{t(item.text)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
