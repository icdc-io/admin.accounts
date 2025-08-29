import { useFetchData } from "container/Api";
import { PRICE_PLANS_URL } from "../AppConstants";

export const getPricePlans = () =>
	useFetchData({
		endpoint: PRICE_PLANS_URL,
		select: (records) => records.data,
	});
