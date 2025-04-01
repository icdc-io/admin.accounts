import { useTranslation } from "react-i18next";
import Attention from "../assets/attention.svg";

const AddInfo = ({ items }) => {
	const { t } = useTranslation();
	const withNumeration = items.length > 1;
	return (
		<div className="add-info">
			<img src={Attention} alt="icon" className="attention-icon" />
			{items.map((info, key) => (
				<p key={key}>
					{withNumeration ? `${key + 1}. ` : ""} {t(info)}
				</p>
			))}
		</div>
	);
};

export default AddInfo;
