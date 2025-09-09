import { CircleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

const AddInfo = ({ items, className = "info", title, icon = CircleAlert }) => {
	const { t } = useTranslation();
	const withNumeration = items?.length > 1;
	const IconComponent = icon;
	return (
		<div className={"add-info " + className}>
			<IconComponent size={16} className="attention-icon" />
			{title && <h4>{t(title)}</h4>}
			{items?.map((info, key) => (
				<p key={key}>
					{withNumeration ? `${key + 1}. ` : ""} {t(info)}
				</p>
			))}
		</div>
	);
};

export default AddInfo;
