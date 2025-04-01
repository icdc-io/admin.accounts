export function dateConvert(date) {
	const dataObj = new Date(date);
	const dd = String(dataObj.getDate()).padStart(2, "0");
	const mm = String(dataObj.getMonth() + 1).padStart(2, "0");
	const yyyy = dataObj.getFullYear();
	const hour = String(dataObj.getHours()).padStart(2, "0");
	const min = String(dataObj.getMinutes()).padStart(2, "0");

	return `${dd}-${mm}-${yyyy}, ${hour}:${min}`;
}
