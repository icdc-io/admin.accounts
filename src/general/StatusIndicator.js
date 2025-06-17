import Popup from "container/Popup";
import { CircleCheck, CircleMinus, Clock } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { accountStatuses } from "../constants/accountStatuses";
import { capitalizeFirstLetter } from "../utilities/CapitalizeFirstLetter";
import { dateConvert } from "../utilities/dateConvert";

const StatusIndicator = ({ item }) => {
	const { t } = useTranslation();

	const commonErrorStyles = {
		backgroundColor: "#FFEBE5",
		color: "#D90B2B",
		iconName: CircleMinus,
	};

	const statusStyles = {
		[accountStatuses.ready]: {
			backgroundColor: "#E7FFE7",
			color: "#0B961F",
			iconName: CircleCheck,
		},
		[accountStatuses.failed]: commonErrorStyles,
		[accountStatuses.deleting]: commonErrorStyles,
		[accountStatuses.deleted]: commonErrorStyles,
		default: {
			backgroundColor: "#EEEEEE",
			color: "#4A4A4A",
			iconName: Clock,
		},
	};

	const { backgroundColor, color, iconName } =
		statusStyles[item.status] || statusStyles.default;
	const IconComponent = iconName;

	const servicesStatuses = ["completed", "failed", "pending"].filter(
		(el) => item.flow_status && item.flow_status[el]?.length > 0,
	);

	const statusComponent = (
		<div className="status-indicator" style={{ backgroundColor, color }}>
			<IconComponent size={16} />
			&nbsp;&nbsp;
			{(item.status === accountStatuses.creating
				? t("creatingWithPercent", { percent: item.flow_status.progress })
				: t(item.status)) || "—"}
		</div>
	);

	if (!item.flow_status) return statusComponent;

	const popupContent = (
		<>
			{servicesStatuses.map((serviceStatus, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<div key={i}>
					<p>{t(serviceStatus)}</p>
					<ul>
						{item.flow_status ? (
							serviceStatus === "pending" ? (
								<li>
									{`${item.flow_status[serviceStatus].length} ${t(
										item.flow_status[serviceStatus].length === 1
											? "oneServiceForStatus"
											: "manyServicesForStatus",
									)}`}
								</li>
							) : (
								item.flow_status[serviceStatus].map((serviceList, i) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<li key={i}>
										{capitalizeFirstLetter(
											serviceList.service.replace("_", " "),
										)}
									</li>
								))
							)
						) : (
							<li>—</li>
						)}
					</ul>
				</div>
			))}
			<span>
				<p>{t("deployed")}:</p> {dateConvert(item.flow_status.started_on)}
			</span>
		</>
	);

	return item.status === accountStatuses.creating ||
		item.status === accountStatuses.pending ||
		item.status === accountStatuses.failed ||
		item.status === accountStatuses.deleting ||
		item.status === accountStatuses.deleted ||
		item.status === accountStatuses.ready ? (
		<Popup content={popupContent} className="status_popup">
			{statusComponent}
		</Popup>
	) : (
		statusComponent
	);
};

export default StatusIndicator;
