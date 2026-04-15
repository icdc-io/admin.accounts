import { Button } from "container/Button";
import { Form, useForm } from "container/Form";
import Loader from "container/Loader";
import { useEffect } from "react";
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
	businessTypeOptions,
	checkIfLegalEntity,
	countryOptions,
	initialState,
	quotasBody,
	taxIdOptions,
	taxIExemptOptions,
} from "../constants/createAccountData";
import { InputFormField } from "../general/FormInputField";
import { formatI18nMessageToString } from "../general/formatErrorMessages";
import { SelectFormField } from "../general/SelectFormField";
import {
	emailPattern,
	idValidationPattern,
	nameWithSpacePattern,
	phoneNumberPattern,
} from "../utilities/validations";
import AddInfo from "./addInfo";
import ConnectProcessModal from "./connectAccountProcess";
import "./createAccount.scss";
import { OctagonAlert } from "lucide-react";
import { RadioFormField } from "../general/RadioFormField";
import { getPricePlans } from "../queries/getPricePlans";

const accountOwnerAddInfo = [
	"accountOwnerInfo1",
	"accountOwnerInfo2",
	"accountOwnerInfo3",
	"accountOwnerInfo4",
	"accountOwnerInfo5",
	"accountOwnerInfo6",
];
const FIELD_MIN_LENGTH = 3;
const billingContactAddInfo = ["billingContactInfo1"];
const formatPricePlanToOption = (pricePlans) =>
	pricePlans.map((pricePlan) => ({
		text: pricePlan.name,
		value: `${pricePlan.id}`,
	}));

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
	const {
		data: pricePlans,
		fetchStatus,
		isSuccess,
		isError,
		isFetching,
	} = getPricePlans();
	const isPricePlansWasFetched = isSuccess && fetchStatus === "idle";
	const pricePlansOptions = pricePlans
		? formatPricePlanToOption(pricePlans)
		: [];
	const isOldSetupApiVersion = setupApiVersion === "old";

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: initialState,
	});
	const businessType = form.watch("businessType");
	const isLegalEntity = checkIfLegalEntity(businessType);
	const getDefaultPricePlan = () =>
		(pricePlans || []).find((pricePlan) => pricePlan.default);

	useEffect(() => {
		if (isPricePlansWasFetched) {
			const defaultPricePlan = getDefaultPricePlan();
			if (defaultPricePlan)
				form.setValue("initial_price_plan_id", `${defaultPricePlan.id}`);
		}
	}, [isPricePlansWasFetched]);

	const changeExtraField = (fieldName) => (value) =>
		form.setValue(fieldName, value);

	const changeTaxParams = (businessType) => {
		const isLegalEntity = checkIfLegalEntity(businessType);
		form.setValue(
			"billing.tax_id_type",
			isLegalEntity ? taxIdOptions[0].value : "",
		);
		form.setValue(
			"billing.tax_exempt",
			isLegalEntity ? taxIExemptOptions[0].value : "",
		);
	};

	useEffect(() => {
		!setupApiVersion && dispatch(fetchAccountsData(location));
	}, [setupApiVersion]);

	useEffect(() => {
		if (accountRegistrationStatus === "fulfilled") {
			const currentPricePlanId = +form.getValues("initial_price_plan_id");
			const accountDisplayName = form.getValues("general.display_name");
			const accountName = form.getValues("name");
			const setupAccountPayload = quotasBody(accountName, accountDisplayName);
			setupAccountPayload.quotas.billing.initial_price_plan_id =
				currentPricePlanId;

			dispatch(setupAccount([setupAccountPayload]));
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

	const onSubmit = (values) => {
		const { businessType, initial_price_plan_id: _, ...form } = values;
		const isLegalEntity = checkIfLegalEntity(businessType);
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

	const getContent = () => {
		if (
			!isOldSetupApiVersion &&
			(accountRegistrationStatus === "pending" || setupStatus === "pending")
		)
			return <Loader />;
		if (isOldSetupApiVersion && accountRegistrationStatus === "pending")
			return <Loader />;

		return (
			<Form {...form}>
				<h2>{t("creatingAccount")}</h2>
				<form
					className="createAccountForm"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="section_wrapper">
						<h3>{t("infoAccount")}</h3>
						<div className="inputs_grid">
							<InputFormField
								form={form}
								fieldInfo={{
									name: "general.display_name",
									placeholder: "enterName",
									label: "display_name",
									rules: {
										required: "required",
										pattern: {
											value: nameWithSpacePattern,
											message: "nameWithSpace",
										},
									},
								}}
							/>
							<InputFormField
								form={form}
								fieldInfo={{
									name: "name",
									placeholder: "enterId",
									label: "ID",
									rules: {
										required: "required",
										maxLength: 5,
										minLength: {
											value: FIELD_MIN_LENGTH,
											message: formatI18nMessageToString(
												"minLength",
												FIELD_MIN_LENGTH,
											),
										},
										pattern: {
											value: idValidationPattern,
											message: "idValidation",
										},
									},
								}}
							/>
						</div>
					</div>
					<div className="section_wrapper">
						<h3>{t("pricePlan")}</h3>
						<SelectFormField
							form={form}
							fieldInfo={{
								name: "initial_price_plan_id",
								options: pricePlansOptions,
								label: "selectPricePlan",
								placeholder: "selectPricePlan",
								disabled: isError,
								rules: {
									required: "required",
								},
								isLoading: isFetching,
							}}
						>
							{isError && (
								<AddInfo
									title={"pricePlansFetchingError"}
									className="warning"
									icon={OctagonAlert}
								/>
							)}
						</SelectFormField>
					</div>
					<div className="section_wrapper">
						<h3>{t("accountOwner")}</h3>
						<AddInfo items={accountOwnerAddInfo} />
						<div className="inputs_grid">
							<InputFormField
								form={form}
								fieldInfo={{
									name: "general.contact.first_name",
									placeholder: "enterFirstName",
									label: "firstName",
									rules: {
										required: "required",
									},
								}}
							/>
							<InputFormField
								form={form}
								fieldInfo={{
									name: "general.contact.last_name",
									placeholder: "enterLastName",
									label: "lastName",
									rules: {
										required: "required",
									},
								}}
							/>
							<InputFormField
								form={form}
								fieldInfo={{
									name: "general.contact.title",
									placeholder: "enterTitle",
									label: "title",
									rules: {
										required: "required",
										minLength: {
											value: FIELD_MIN_LENGTH,
											message: formatI18nMessageToString(
												"minLength",
												FIELD_MIN_LENGTH,
											),
										},
									},
								}}
							/>
							<InputFormField
								form={form}
								fieldInfo={{
									name: "general.contact.email",
									placeholder: "enterEmail",
									label: "email",
									onChange: isLegalEntity
										? undefined
										: changeExtraField("general.email"),
									rules: {
										required: "required",
										pattern: {
											value: emailPattern,
											message: "email",
										},
									},
								}}
							/>
							<InputFormField
								form={form}
								fieldInfo={{
									name: "general.contact.phone",
									placeholder: "enterPhone",
									label: "phone",
									onChange: isLegalEntity
										? undefined
										: changeExtraField("general.phone"),
									rules: {
										required: "required",
										pattern: {
											value: phoneNumberPattern,
											message: "phoneNumberValidation",
										},
									},
								}}
							/>
						</div>
					</div>

					<div className="section_wrapper">
						<h3>{t("businessInfo")}</h3>
						<div className="inputs_grid">
							<SelectFormField
								form={form}
								fieldInfo={{
									options: businessTypeOptions,
									label: "typeOfBusiness",
									name: "businessType",
									placeholder: "typeOfBusiness",
									onChange: changeTaxParams,
								}}
							/>
							{!isLegalEntity && (
								<InputFormField
									form={form}
									fieldInfo={{
										name: "billing.name",
										placeholder: "enterCustomerFullName",
										label: "customerFullName",
										clarification: "customerNamePrompt",
										rules: {
											required: "required",
											pattern: {
												value: nameWithSpacePattern,
												message: "nameWithSpace",
											},
										},
									}}
								/>
							)}
							{isLegalEntity && (
								<>
									<InputFormField
										form={form}
										fieldInfo={{
											name: "billing.name",
											placeholder: "enterOrganizationName",
											label: "organizationName",
											rules: {
												required: "required",
											},
										}}
									/>
									<InputFormField
										form={form}
										fieldInfo={{
											name: "billing.phone",
											placeholder: "enterPhone",
											label: "phone",
											onChange: changeExtraField("general.phone"),
											rules: {
												required: "required",
												pattern: {
													value: phoneNumberPattern,
													message: "phoneNumberValidation",
												},
											},
										}}
									/>
									<InputFormField
										form={form}
										fieldInfo={{
											name: "billing.email",
											placeholder: "enterEmail",
											label: "email",
											onChange: changeExtraField("general.email"),
											rules: {
												required: "required",
												pattern: {
													value: emailPattern,
													message: "email",
												},
											},
										}}
									/>
								</>
							)}
						</div>
					</div>

					<div className="section_wrapper">
						<h3>{isLegalEntity ? t("address") : t("residenceAddress")}</h3>
						<div className="inputs_grid">
							<InputFormField
								form={form}
								fieldInfo={{
									name: "billing.address.street",
									placeholder: "enterAdress",
									label: "address",
									rules: {
										required: "required",
										minLength: {
											value: FIELD_MIN_LENGTH,
											message: formatI18nMessageToString(
												"minLength",
												FIELD_MIN_LENGTH,
											),
										},
									},
								}}
							/>

							<SelectFormField
								form={form}
								fieldInfo={{
									options: countryOptions,
									label: "country",
									name: "billing.address.country",
									placeholder: "country",
								}}
							/>

							<InputFormField
								form={form}
								fieldInfo={{
									name: "billing.address.city",
									placeholder: "enterCity",
									label: "city",
									rules: {
										required: "required",
										minLength: {
											value: FIELD_MIN_LENGTH,
											message: formatI18nMessageToString(
												"minLength",
												FIELD_MIN_LENGTH,
											),
										},
									},
								}}
							/>
							<InputFormField
								form={form}
								fieldInfo={{
									name: "billing.address.state",
									placeholder: "enterRegion",
									label: "region",
									rules: {
										required: "required",
										minLength: {
											value: FIELD_MIN_LENGTH,
											message: formatI18nMessageToString(
												"minLength",
												FIELD_MIN_LENGTH,
											),
										},
									},
								}}
							/>
							<InputFormField
								form={form}
								fieldInfo={{
									name: "billing.address.postal_code",
									placeholder: "enterZip",
									label: "zipCode",
									rules: {
										required: "required",
									},
								}}
							/>
						</div>
					</div>

					{isLegalEntity && (
						<>
							<div className="section_wrapper">
								<h3>{t("billingInfo")}</h3>
								<div className="inputs_grid">
									<InputFormField
										form={form}
										fieldInfo={{
											name: "billing.tax_id",
											placeholder: "enterTaxId",
											label: "taxId",
											rules: {
												required: "required",
											},
										}}
									/>
									<RadioFormField
										form={form}
										fieldInfo={{
											name: "billing.tax_exempt",
											label: "taxExempt",
											options: taxIExemptOptions,
										}}
									/>
									<SelectFormField
										form={form}
										fieldInfo={{
											options: taxIdOptions,
											label: "taxIdtype",
											name: "billing.tax_id_type",
											placeholder: "taxIdtype",
										}}
									/>
								</div>
							</div>
							<div className="section_wrapper">
								<h3>{t("paymentMethod")}</h3>
								<div className="inputs_grid">
									<InputFormField
										form={form}
										fieldInfo={{
											name: "payment_methods.0.bank_transfer.bank_name",
											placeholder: "enterBankName",
											label: "bankName",
											rules: {
												minLength: {
													value: FIELD_MIN_LENGTH,
													message: formatI18nMessageToString(
														"minLength",
														FIELD_MIN_LENGTH,
													),
												},
											},
										}}
									/>
									<InputFormField
										form={form}
										fieldInfo={{
											name: "payment_methods.0.bank_transfer.bank_address.street",
											placeholder: "enterAdress",
											label: "bankAddress",
											rules: {
												minLength: {
													value: FIELD_MIN_LENGTH,
													message: formatI18nMessageToString(
														"minLength",
														FIELD_MIN_LENGTH,
													),
												},
											},
										}}
									/>
									<InputFormField
										form={form}
										fieldInfo={{
											name: "payment_methods.0.bank_transfer.iban",
											placeholder: "enterPaymentAccNumber",
											label: "paymentAccNumber",
											rules: {
												minLength: {
													value: FIELD_MIN_LENGTH,
													message: formatI18nMessageToString(
														"minLength",
														FIELD_MIN_LENGTH,
													),
												},
											},
										}}
									/>
									<InputFormField
										form={form}
										fieldInfo={{
											name: "payment_methods.0.bank_transfer.bic",
											placeholder: "enterBic",
											label: "bic",
											rules: {
												minLength: {
													value: FIELD_MIN_LENGTH,
													message: formatI18nMessageToString(
														"minLength",
														FIELD_MIN_LENGTH,
													),
												},
											},
										}}
									/>
								</div>
							</div>
						</>
					)}

					{isLegalEntity && (
						<div className="section_wrapper">
							<h3>{t("billingContact")}</h3>
							<AddInfo t={t} items={billingContactAddInfo} />
							<div className="inputs_grid">
								<InputFormField
									form={form}
									fieldInfo={{
										name: "billing.contact.first_name",
										placeholder: "enterFirstName",
										label: "firstName",
										rules: {
											required: "required",
										},
									}}
								/>
								<InputFormField
									form={form}
									fieldInfo={{
										name: "billing.contact.last_name",
										placeholder: "enterLastName",
										label: "lastName",
										rules: {
											required: "required",
										},
									}}
								/>
								<InputFormField
									form={form}
									fieldInfo={{
										name: "billing.contact.title",
										placeholder: "enterTitle",
										label: "title",
										rules: {
											required: "required",
										},
									}}
								/>
								<InputFormField
									form={form}
									fieldInfo={{
										name: "billing.contact.email",
										placeholder: "enterEmail",
										label: "email",
										rules: {
											required: "required",
											pattern: {
												value: emailPattern,
												message: "email",
											},
										},
									}}
								/>
								<InputFormField
									form={form}
									fieldInfo={{
										name: "billing.contact.phone",
										placeholder: "enterPhone",
										label: "phone",
										rules: {
											required: "required",
											pattern: {
												value: phoneNumberPattern,
												message: "phoneNumberValidation",
											},
										},
									}}
								/>
							</div>
						</div>
					)}

					<div className="formActions flex flex-wrap gap-2">
						<Link to="..">
							<Button type="button" variant="secondary">
								{t("cancel")}
							</Button>
						</Link>
						<Button type="submit">{t("create")}</Button>
					</div>
				</form>
			</Form>
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
