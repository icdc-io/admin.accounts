import { Input } from "container/Input";
import Popup from "container/Popup";
import { CircleHelp } from "lucide-react";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const ValidInput = ({
	label,
	name,
	type = "text",
	initialValue,
	validFunctions,
	result,
	placeholder,
	popupContent,
}) => {
	const [value, setValue] = useState(initialValue || "");
	const [messageError, setMessageError] = useState("");
	const isPassword = type === "password" && initialValue;
	const inputValue = isPassword ? initialValue?.substring(0, 8) : value;
	const check = (firstRender) => {
		for (let i = 0; i < validFunctions.length; i++) {
			const isError = validFunctions[i](value);
			if (isError) {
				setMessageError(firstRender ? "" : isError);
				result("");
				break;
			}

			if (firstRender && !isError && i === validFunctions.length - 1) {
				setMessageError("");
				result(value);
			}
		}
	};

	const blurCheck = () => {
		check();
	};

	const onFocus = () => {
		isPassword && setValue("");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		check(true);
	}, [value]);

	const inputClass = [];
	messageError && inputClass.push("invalid");

	return (
		<div className="general-input">
			<label htmlFor={name}>
				{label}&nbsp;
				{popupContent && (
					<Popup content={popupContent}>
						<button type="button">
							<CircleHelp size={16} />
						</button>
					</Popup>
				)}
			</label>
			<Input
				type={type}
				name={name}
				autoComplete="off"
				onBlur={blurCheck}
				onFocus={onFocus}
				value={inputValue}
				onChange={(e) => setValue(e.target.value)}
				placeholder={placeholder}
				className={messageError ? "invalid" : ""}
			/>
			{messageError && (
				<p className="text-[0.8rem] font-medium text-destructive mt-2">
					{messageError}
				</p>
			)}
		</div>
	);
};

ValidInput.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	type: PropTypes.string,
	initialValue: PropTypes.any,
	validFunctions: PropTypes.array,
	result: PropTypes.func,
	placeholder: PropTypes.any,
	popupContent: PropTypes.node,
};

export default ValidInput;
