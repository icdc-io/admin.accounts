import React, { useEffect, useState } from "react";
import "./createAccount.scss";
import { Button } from "container/Button";
import { Label } from "container/Label";
import Loader from "container/Loader";
import { RadioGroup, RadioGroupItem } from "container/Radio";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "container/Select";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
	createAccount,
	fetchAccountsData,
	resetSetupStatus,
	resetStatusAccount,
	setupAccount,
} from "../AppActions";
import {
	countryOptions,
	initialState,
	quotasBody,
	taxIdOptions,
} from "../constants/createAccountData";
import {
	email,
	idValidation,
	minLength,
	nameWithSpace,
	number,
	phoneNumber,
	required,
} from "../utilities/validations";
import AddInfo from "./addInfo";
import ConnectProcessModal from "./connectAccountProcess";
import ValidInput from "./validInput";

const accountOwnerAddInfo = [
	"accountOwnerInfo1",
	"accountOwnerInfo2",
	"accountOwnerInfo3",
	"accountOwnerInfo4",
	"accountOwnerInfo5",
	"accountOwnerInfo6",
];
const billingContactAddInfo = ["billingContactInfo1"];

const CreateAccount = () => {
	const { t } = useTranslation();
	const user = useSelector((state) => state.host.user);
	const accountRegistrationStatus = useSelector(
		(state) => state.AccountsStore.accountRegistrationStatus,
	);
	const setupStatus = useSelector((state) => state.AccountsStore.setupStatus);
	const setupApiVersion = useSelector(
		(state) => state.AccountsStore.setupApiVersion,
	);
	const location = useSelector((state) => state.host.user.location);

	const isOldSetupApiVersion = setupApiVersion === "old";

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const businessTypeOptions = [
		{ text: t("naturalPerson"), value: "Natural Person" },
		{ text: t("legalEntity"), value: "Legal Entity" },
	];

	const [form, setForm] = useState(initialState);
	const [quotas, setQuotas] = useState(quotasBody);
	const [businessType, setBusinessType] = useState(
		businessTypeOptions[0].value,
	);
	const isLegalEntity = businessType === "Legal Entity";

	useEffect(() => {
		!setupApiVersion && dispatch(fetchAccountsData(location));
	}, [setupApiVersion]);

	useEffect(() => {
		isLegalEntity
			? setForm({
					...form,
					billing: {
						...form.billing,
						tax_id_type: taxIdOptions[0].value,
						tax_exempt: "none",
					},
				})
			: setForm({
					...form,
					billing: { ...form.billing, tax_id_type: "", tax_exempt: "" },
				});
	}, [businessType]);

	useEffect(() => {
		if (accountRegistrationStatus === "fulfilled") {
			dispatch(setupAccount(quotas));
		}
	}, [accountRegistrationStatus]);

	useEffect(() => {
		if (setupStatus === "fulfilled") {
			navigate("..");
		}
	}, [setupStatus]);

	useEffect(
		() => () => {
			dispatch(resetStatusAccount());
			dispatch(resetSetupStatus());
		},
		[],
	);

	const createNewAccount = () => {
		const body = isLegalEntity
			? {
					...form,
					billing: {
						...form.billing,
						email: form.general.email,
						phone: form.general.phone,
					},
					locations: [...form.locations, user.location],
					payment_methods: [...form.payment_methods].map((el) => ({
						...el,
						service_provider: user.account,
						type: "bank_transfer",
					})),
				}
			: {
					...form,
					billing: {
						...form.billing,
						email: form.general.email,
						phone: form.general.phone,
						contact: {
							...form.general.contact,
						},
					},
					payment_methods: [],
					locations: [...form.locations, user.location],
				};

		dispatch(createAccount(body));
	};

	const disabled =
		accountRegistrationStatus === "pending" ||
		form.general.display_name === "" ||
		form.name === "" ||
		form.general.contact.email === "" ||
		form.general.contact.first_name === "" ||
		form.general.contact.last_name === "" ||
		form.general.contact.title === "" ||
		form.general.contact.phone === "" ||
		form.billing.address.street === "" ||
		form.billing.address.city === "" ||
		form.billing.address.state === "" ||
		form.billing.address.postal_code === "";

	const disabledForLegal =
		accountRegistrationStatus === "pending" ||
		form.billing.name === "" ||
		form.billing.phone === "" ||
		form.billing.email === "" ||
		form.billing.contact.first_name === "" ||
		form.billing.contact.last_name === "" ||
		form.billing.contact.title === "" ||
		form.billing.contact.email === "" ||
		form.billing.contact.phone === "" ||
		form.billing.tax_id === "" ||
		form.billing.tax_exempt === "" ||
		form.billing.tax_id_type === "";

	const getContent = () => {
		if (
			!isOldSetupApiVersion &&
			(accountRegistrationStatus === "pending" || setupStatus === "pending")
		)
			return <Loader />;
		if (isOldSetupApiVersion && accountRegistrationStatus === "pending")
			return <Loader />;

		return (
			<>
				<h2>{t("creatingAccount")}</h2>
				<form className="createAccountForm">
					<h3>{t("infoAccount")}</h3>
					<ValidInput
						label={t("display_name")}
						name="displayName"
						placeholder={t("enterName")}
						initialValue={form.general.display_name}
						validFunctions={[required, nameWithSpace]}
						result={(value) => {
							setForm((prevState) => ({
								...prevState,
								general: { ...form.general, display_name: value },
							}));
							setQuotas(
								[...quotas].map((el) => ({
									...el,
									quotas: {
										...el.quotas,
										compute: { ...el.quotas.compute, description: value },
										storage: { ...el.quotas.storage, description: value },
										networking: { ...el.quotas.networking, description: value },
										billing_engine: {
											...el.quotas.networking,
											description: value,
										},
										artifactory: {
											...el.quotas.artifactory,
											description: value,
										},
									},
								})),
							);
						}}
					/>
					<ValidInput
						label="ID"
						name="id"
						placeholder={t("enterId")}
						initialValue={form.name}
						validFunctions={[required, idValidation]}
						result={(value) => {
							setForm((prevState) => ({ ...prevState, name: value }));
							setQuotas(
								[...quotas].map((el) => ({ ...el, accountName: value })),
							);
						}}
					/>
					<br />
					<h3>{t("accountOwner")}</h3>
					<br />
					<AddInfo t={t} items={accountOwnerAddInfo} />
					<ValidInput
						label={t("firstName")}
						name="firstName"
						placeholder={t("enterFirstName")}
						initialValue={form.general.contact.first_name}
						validFunctions={[required]}
						result={(value) =>
							setForm((prevState) => ({
								...prevState,
								general: {
									...form.general,
									contact: { ...form.general.contact, first_name: value },
								},
							}))
						}
					/>
					<ValidInput
						label={t("lastName")}
						name="lastName"
						placeholder={t("enterLastName")}
						initialValue={form.general.contact.last_name}
						validFunctions={[required]}
						result={(value) =>
							setForm({
								...form,
								general: {
									...form.general,
									contact: { ...form.general.contact, last_name: value },
								},
							})
						}
					/>
					<ValidInput
						label={t("title")}
						name="title"
						placeholder={t("enterTitle")}
						initialValue={form.general.contact.title}
						validFunctions={[required, minLength]}
						result={(value) =>
							setForm({
								...form,
								general: {
									...form.general,
									contact: { ...form.general.contact, title: value },
								},
							})
						}
					/>
					<ValidInput
						label={t("email")}
						name="email"
						placeholder={t("enterEmail")}
						initialValue={form.general.contact.email}
						validFunctions={[required, email]}
						result={(value) =>
							setForm({
								...form,
								general: {
									...form.general,
									email: isLegalEntity ? form.general.email : value,
									contact: { ...form.general.contact, email: value },
								},
							})
						}
					/>
					<ValidInput
						label={t("phone")}
						name="phone"
						placeholder={t("enterPhone")}
						initialValue={form.general.contact.phone}
						validFunctions={[required, phoneNumber]}
						result={(value) =>
							setForm({
								...form,
								general: {
									...form.general,
									phone: isLegalEntity ? form.general.phone : value,
									contact: { ...form.general.contact, phone: value },
								},
							})
						}
					/>
					<br />
					<h3>{t("businessInfo")}</h3>
					<div className="general-input">
						<Label>{t("typeOfBusiness")}</Label>
						<Select
							value={businessType}
							onValueChange={(value) => setBusinessType(value)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{businessTypeOptions.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.text}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					{!isLegalEntity && (
						<ValidInput
							popupContent={t("customerNamePrompt")}
							label={t("customerFullName")}
							name="customerFullName"
							placeholder={t("enterCustomerFullName")}
							initialValue={form.billing.name}
							validFunctions={[required, nameWithSpace]}
							result={(value) =>
								setForm({
									...form,
									billing: { ...form.billing, name: value },
								})
							}
						/>
					)}
					{isLegalEntity && (
						<div>
							<ValidInput
								label={t("organizationName")}
								name="organizationName"
								placeholder={t("enterOrganizationName")}
								initialValue={form.billing.name}
								validFunctions={[required]}
								result={(value) =>
									setForm({
										...form,
										billing: { ...form.billing, name: value },
									})
								}
							/>
							<ValidInput
								label={t("phone")}
								name="phone"
								placeholder={t("enterPhone")}
								initialValue={form.billing.phone}
								validFunctions={[required, phoneNumber]}
								result={(value) =>
									setForm({
										...form,
										billing: { ...form.billing, phone: value },
										general: { ...form.general, phone: value },
									})
								}
							/>
							<ValidInput
								label={t("email")}
								name="email"
								placeholder={t("enterEmail")}
								initialValue={form.billing.email}
								validFunctions={[required, email]}
								result={(value) =>
									setForm({
										...form,
										billing: { ...form.billing, email: value },
										general: { ...form.general, email: value },
									})
								}
							/>
						</div>
					)}
					<br />
					<h3>{isLegalEntity ? t("address") : t("residenceAddress")}</h3>
					<ValidInput
						label={t("address")}
						name="address"
						placeholder={t("enterAdress")}
						initialValue={form.billing.address.street}
						validFunctions={[required, minLength]}
						result={(value) =>
							setForm({
								...form,
								billing: {
									...form.billing,
									address: { ...form.billing.address, street: value },
								},
							})
						}
					/>

					<div className="general-input">
						<Label>{t("country")}</Label>
						<Select
							defaultValue={countryOptions[0].value}
							onValueChange={(value) =>
								setForm({
									...form,
									billing: {
										...form.billing,
										address: { ...form.billing.address, country: value },
									},
								})
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{countryOptions.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.text}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<ValidInput
						label={t("city")}
						name="city"
						placeholder={t("enterCity")}
						initialValue={form.billing.address.city}
						validFunctions={[required, minLength]}
						result={(value) =>
							setForm({
								...form,
								billing: {
									...form.billing,
									address: { ...form.billing.address, city: value },
								},
							})
						}
					/>
					<ValidInput
						label={t("region")}
						name="region"
						placeholder={t("enterRegion")}
						initialValue={form.billing.address.state}
						validFunctions={[required, minLength]}
						result={(value) =>
							setForm({
								...form,
								billing: {
									...form.billing,
									address: { ...form.billing.address, state: value },
								},
							})
						}
					/>
					<ValidInput
						label={t("zipCode")}
						name="zipCode"
						placeholder={t("enterZip")}
						initialValue={form.billing.address.postal_code}
						validFunctions={[required]}
						result={(value) =>
							setForm({
								...form,
								billing: {
									...form.billing,
									address: { ...form.billing.address, postal_code: value },
								},
							})
						}
					/>
					{isLegalEntity && (
						<div>
							<br />
							<h3>{t("billingInfo")}</h3>
							<ValidInput
								label={t("taxId")}
								name="taxId"
								placeholder={t("enterTaxId")}
								initialValue={form.billing.tax_id}
								validFunctions={[required]}
								result={(value) =>
									setForm({
										...form,
										billing: { ...form.billing, tax_id: value },
									})
								}
							/>
							<div className="general-input taxExempt">
								<Label>{t("taxExempt")}</Label>
								<RadioGroup
									onValueChange={(value) =>
										setForm((prevState) => ({
											...prevState,
											billing: {
												...prevState.billing,
												tax_exempt: value,
											},
										}))
									}
									value={form.billing.tax_exempt}
									className="flex radio-group"
								>
									<div className="flex flex-row items-center space-x-3 space-y-0">
										<RadioGroupItem value={"none"} />
										<Label className="font-normal">{t("noTaxExempt")}</Label>
									</div>
									<div className="flex flex-row items-center space-x-3 space-y-0">
										<RadioGroupItem value={"yes"} />
										<Label className="font-normal">{t("yesTaxExempt")}</Label>
									</div>
								</RadioGroup>
							</div>
							<div className="general-input">
								<Label>{t("taxIdtype")}</Label>
								<Select
									defaultValue={taxIdOptions[0].value}
									onValueChange={(value) =>
										setForm({
											...form,
											billing: { ...form.billing, tax_id_type: value },
										})
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{taxIdOptions.map((item) => (
											<SelectItem key={item.value} value={item.value}>
												{item.text}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<br />
							<h3>{t("paymentMethod")}</h3>
							<ValidInput
								label={t("bankName")}
								name="bankName"
								placeholder={t("enterBankName")}
								initialValue={form.payment_methods[0].bank_transfer.bank_name}
								validFunctions={[minLength]}
								result={(value) =>
									setForm({
										...form,
										payment_methods: [...form.payment_methods].map(
											(el, index) =>
												index === 0
													? {
															...el,
															bank_transfer: {
																...el.bank_transfer,
																bank_name: value,
															},
														}
													: el,
										),
									})
								}
							/>
							<ValidInput
								label={t("bankAddress")}
								name="bankAddress"
								placeholder={t("enterAdress")}
								initialValue={
									form.payment_methods[0].bank_transfer.bank_address.street
								}
								validFunctions={[minLength]}
								result={(value) =>
									setForm({
										...form,
										payment_methods: [...form.payment_methods].map(
											(el, index) =>
												index === 0
													? {
															...el,
															bank_transfer: {
																...el.bank_transfer,
																bank_address: {
																	...el.bank_transfer.bank_address,
																	street: value,
																},
															},
														}
													: el,
										),
									})
								}
							/>
							<ValidInput
								label={t("paymentAccNumber")}
								name="paymentAccNumber"
								placeholder={t("enterPaymentAccNumber")}
								initialValue={form.payment_methods[0].bank_transfer.iban}
								validFunctions={[minLength]}
								result={(value) =>
									setForm({
										...form,
										payment_methods: [...form.payment_methods].map(
											(el, index) =>
												index === 0
													? {
															...el,
															bank_transfer: {
																...el.bank_transfer,
																iban: value,
															},
														}
													: el,
										),
									})
								}
							/>
							<ValidInput
								label={t("bic")}
								name="bic"
								placeholder={t("enterBic")}
								initialValue={form.payment_methods[0].bank_transfer.bic}
								validFunctions={[minLength]}
								result={(value) =>
									setForm({
										...form,
										payment_methods: [...form.payment_methods].map(
											(el, index) =>
												index === 0
													? {
															...el,
															bank_transfer: {
																...el.bank_transfer,
																bic: value,
															},
														}
													: el,
										),
									})
								}
							/>
						</div>
					)}
					{isLegalEntity && (
						<>
							<br />
							<h3>{t("billingContact")}</h3>
							<br />
							<AddInfo t={t} items={billingContactAddInfo} />
							<ValidInput
								label={t("firstName")}
								name="firstName"
								placeholder={t("enterFirstName")}
								initialValue={form.billing.contact.first_name}
								validFunctions={[required]}
								result={(value) =>
									setForm({
										...form,
										billing: {
											...form.billing,
											contact: { ...form.billing.contact, first_name: value },
										},
									})
								}
							/>
							<ValidInput
								label={t("lastName")}
								name="lastName"
								placeholder={t("enterLastName")}
								initialValue={form.billing.contact.last_name}
								validFunctions={[required]}
								result={(value) =>
									setForm({
										...form,
										billing: {
											...form.billing,
											contact: { ...form.billing.contact, last_name: value },
										},
									})
								}
							/>
							<ValidInput
								label={t("title")}
								name="title"
								placeholder={t("enterTitle")}
								initialValue={form.billing.contact.title}
								validFunctions={[required]}
								result={(value) =>
									setForm({
										...form,
										billing: {
											...form.billing,
											contact: { ...form.billing.contact, title: value },
										},
									})
								}
							/>
							<ValidInput
								label={t("email")}
								name="email"
								placeholder={t("enterEmail")}
								initialValue={form.billing.contact.email}
								validFunctions={[required, email]}
								result={(value) =>
									setForm({
										...form,
										billing: {
											...form.billing,
											contact: { ...form.billing.contact, email: value },
										},
									})
								}
							/>
							<ValidInput
								label={t("phone")}
								name="phone"
								placeholder={t("enterPhone")}
								initialValue={form.billing.contact.phone}
								validFunctions={[required, phoneNumber]}
								result={(value) =>
									setForm({
										...form,
										billing: {
											...form.billing,
											contact: { ...form.billing.contact, phone: value },
										},
									})
								}
							/>
						</>
					)}
				</form>

				<div className="formActions flex flex-wrap gap-2">
					<Link to="..">
						<Button type="button" variant="secondary">
							{t("cancel")}
						</Button>
					</Link>
					<Button
						onClick={createNewAccount}
						type="submit"
						disabled={
							businessType === "Legal Entity"
								? disabled || disabledForLegal
								: disabled
						}
					>
						{t("create")}
					</Button>
				</div>
			</>
		);
	};

	return (
		<div className="create-account-wrapper">
			<Link to={".."}>
				<Button variant="back">{t("back")}</Button>
			</Link>

			{getContent()}

			{isOldSetupApiVersion && (
				<ConnectProcessModal open={setupStatus === "pending"} />
			)}
		</div>
	);
};

export default CreateAccount;
