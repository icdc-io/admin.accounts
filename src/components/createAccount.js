import React, { useEffect, useState } from 'react';
import './locationAccount.scss';
import { PropTypes } from 'prop-types';
import { Button, Dropdown, Form, Header, Radio, Loader } from 'semantic-ui-react';
import { createAccount, setupAccount } from '../AppActions';
import { useDispatch, useSelector } from 'react-redux';
import ValidInput from './validInput';
import { email, idValidation, minLength, number, phoneNumber, positiveNumber, required, latinLetters } from '../utilities/validations';
import { countryOptions, initialState, quotasBody, taxIdOptions } from '../constants/createAccountData';

const CreateAccount = ({ t, setCreateMode, updateGrid }) => {
    const accountRegistrationStatus = useSelector(state => state.AccountsStore.accountRegistrationStatus);
    const user = useSelector(state => state.host.user);
    const dispatch = useDispatch();

    /* eslint camelcase: 0 */
    const businessTypeOptions = [
        { text: t('naturalPerson'), value: 'Natural Person' },
        { text: t('legalEntity'), value: 'Legal Entity' }];

    const [form, setForm] = useState(initialState);
    const [quotas, setQuotas] = useState(quotasBody);
    const [businessType, setBusinessType] = useState(businessTypeOptions[0].value);
    const [taxExempt, setTaxExempt] = useState(false);

    useEffect(() => {
        !taxExempt
            ? setForm({ ...form, billing: { ...form.billing, tax_exempt: 'none' } })
            : setForm({ ...form, billing: { ...form.billing, tax_exempt: 'yes' } });
    }, [taxExempt]);

    useEffect(() => {
        businessType === 'Legal Entity'
            ? setForm({ ...form, billing: { ...form.billing, tax_id_type: taxIdOptions[0].value, tax_exempt: 'none' } })
            : setForm({ ...form, billing: { ...form.billing, tax_id_type: '',  tax_exempt: '' } });
    }, [businessType]);

    useEffect(() => {
        (accountRegistrationStatus === 'rejected' || accountRegistrationStatus === 'fulfilled') && setCreateMode(false);
        if (accountRegistrationStatus === 'fulfilled') {
            updateGrid();
            dispatch(setupAccount(quotas));
            setForm(initialState);
        }
    }, [accountRegistrationStatus]);

    const createNewAccount = () => {businessType === 'Legal Entity'
        ? dispatch(createAccount({ ...form,
            locations: [...form.locations, user.location],
            payment_methods: [...form.payment_methods].map(el => ({ ...el, service_provider: user.account, type: 'bank_transfer' })) }))
        : dispatch(createAccount({ ...form, payment_methods: [], locations: [...form.locations, user.location] }));
    };

    const disabled = form.general.display_name === ''
	|| form.name === ''
	|| form.general.contact.email === ''
	|| form.general.contact.first_name === ''
	|| form.general.contact.last_name === ''
	|| form.general.contact.title === ''
	|| form.general.contact.phone === ''
	|| form.billing.address.street === ''
	|| form.billing.address.city === ''
	|| form.billing.address.state === ''
	|| form.billing.address.postal_code === ''
	|| accountRegistrationStatus === 'pending';

    const disabledForLegal = form.billing.name === ''
	|| form.billing.phone === ''
	|| form.billing.email === ''
	|| form.billing.contact.first_name === ''
	|| form.billing.contact.last_name === ''
	|| form.billing.contact.title === ''
	|| form.billing.contact.email === ''
	|| form.billing.contact.phone === ''
	|| form.billing.tax_id === ''
	|| form.billing.tax_exempt === ''
	|| form.billing.tax_id_type === '';

    return (<section className='location-accounts' >
        <Button
            labelPosition='left'
            icon='left chevron'
            content={t('back')}
            onClick={() => setCreateMode(false)} />
        <div className='accounts-wrapper' style={{ paddingLeft: '0px' }}>
            <h2>{t('creatingAccount')}</h2>
        </div>
        <Form className='createAccountForm' style={{ width: '340px' }}>
            <Header as='h3'>{t('infoAccount')}</Header>
            <ValidInput
                label={t('display_name')}
                name='displayName'
                placeholder={t('enterName')}
                initialValue={form.general.display_name}
                validFunctions={[required, latinLetters]}
                result={value => {
                    setForm(prevState => ({ ...prevState, general: { ...form.general, display_name: value } }));
                    setQuotas([...quotas].map(el => ({ ...el, quotas: { ... el.quotas,
                        compute: { ...el.quotas.compute, description: value },
                        storage: { ...el.quotas.storage, description: value },
                        networking: { ...el.quotas.networking, description: value } } }))
                    );}} />
            <ValidInput
                label='ID'
                name='id'
                placeholder={t('enterId')}
                initialValue={form.name}
                validFunctions={[required, idValidation]}
                result={value => {setForm(prevState => ({ ...prevState, name: value }));
                    setQuotas([...quotas].map(el => ({ ...el, accountName: value })));
                }} />
            <Header as='h3'>{t('accountAdmin')}</Header>
            <ValidInput
                label={t('firstName')}
                name='firstName'
                placeholder={t('enterFirstName')}
                initialValue={form.general.contact.first_name}
                validFunctions={[required]}
                result={value => setForm(prevState => ({ ...prevState, general:
                    { ...form.general, contact: { ...form.general.contact, first_name: value } } }))} />
            <ValidInput
                label={t('lastName')}
                name='lastName'
                placeholder={t('enterLastName')}
                initialValue={form.general.contact.last_name}
                validFunctions={[required]}
                result={value => setForm({ ...form, general: { ...form.general, contact: { ...form.general.contact, last_name: value } } })} />
            <ValidInput
                label={t('title')}
                name='title'
                placeholder={t('enterTitle')}
                initialValue={form.general.contact.title}
                validFunctions={[required, minLength]}
                result={value => setForm({ ...form, general: { ...form.general, contact: { ...form.general.contact, title: value } } })} />
            <ValidInput
                label={t('email')}
                name='email'
                placeholder={t('enterEmail')}
                initialValue={form.general.contact.email}
                validFunctions={[required, email]}
                result={value => setForm({ ...form, general: { ...form.general, email: value,  contact: { ...form.general.contact, email: value } } })} />
            <ValidInput
                label={t('phone')}
                name='phone'
                placeholder={t('enterPhone')}
                initialValue={form.general.contact.phone}
                validFunctions={[required, phoneNumber]}
                result={value => setForm({ ...form, general: { ...form.general, phone: value, contact: { ...form.general.contact, phone: value } } })} />

            <Header as='h3'>{t('businessInfo')}</Header>
            <div className='general-input'>
                <label>{t('typeOfBusiness')}</label>
                <Dropdown selection options={businessTypeOptions} style={{ width: '100%' }}
                    onChange={(param, data) => setBusinessType(data.value)} defaultValue={businessTypeOptions[0].value}/>
            </div>

            {businessType === 'Legal Entity' && <div>
                <ValidInput
                    label={t('organizationName')}
                    name='organizationName'
                    placeholder={t('enterOrganizationName')}
                    initialValue={form.billing.name}
                    validFunctions={[required]}
                    result={value => setForm({ ...form, billing: { ...form.billing, name: value } })} />
                <ValidInput
                    label={t('phone')}
                    name='phone'
                    placeholder={t('enterPhone')}
                    initialValue={form.billing.phone}
                    validFunctions={[required, phoneNumber]}
                    result={value => setForm({ ...form, billing: { ...form.billing, phone: value } })} />
                <ValidInput
                    label={t('email')}
                    name='email'
                    placeholder={t('enterEmail')}
                    initialValue={form.billing.email}
                    validFunctions={[required, email]}
                    result={value => setForm({ ...form, billing: { ...form.billing, email: value } })} />
            </div>}

            <Header as='h3'>{businessType === 'Legal Entity'
                ? t('address')
                : t('residenceAddress')}</Header>
            <ValidInput
                label={t('address')}
                name='address'
                placeholder={t('enterAdress')}
                initialValue={form.billing.address.street}
                validFunctions={[required, minLength]}
                result={value => setForm({ ...form, billing: { ...form.billing, address: { ...form.billing.address, street: value } } })} />

            <div className='general-input'>
                <label>{t('country')}</label>
                <Dropdown selection options={countryOptions} defaultValue={countryOptions[0].value} style={{ width: '100%' }}
                    onChange={(param, data) => setForm({ ...form, billing: { ...form.billing, address: { ...form.billing.address, country: data.value } } })}/>
            </div>

            <ValidInput
                label={t('city')}
                name='city'
                placeholder={t('enterCity')}
                initialValue={form.billing.address.city}
                validFunctions={[required, minLength]}
                result={value => setForm({ ...form, billing: { ...form.billing, address: { ...form.billing.address, city: value } } })} />
            <ValidInput
                label={t('region')}
                name='region'
                placeholder={t('enterRegion')}
                initialValue={form.billing.address.state}
                validFunctions={[required, minLength]}
                result={value => setForm({ ...form, billing: { ...form.billing, address: { ...form.billing.address, state: value } } })} />
            <ValidInput
                label={t('zipCode')}
                name='zipCode'
                placeholder={t('enterZip')}
                initialValue={form.billing.address.postal_code}
                validFunctions={[required, number, positiveNumber]}
                result={value => setForm({ ...form, billing: { ...form.billing, address: { ...form.billing.address, postal_code: value } } })} />

            {businessType === 'Legal Entity' && <div>
                <Header as='h3' style={{ marginTop: '20px' }}>{t('billingInfo')}</Header>
                <ValidInput
                    label={t('taxId')}
                    name='taxId'
                    placeholder={t('enterTaxId')}
                    initialValue={form.billing.tax_id}
                    validFunctions={[required, number]}
                    result={value => setForm({ ...form, billing: { ...form.billing, tax_id: value } })} />
                <div className='general-input taxExempt'>
                    <label>{t('taxExempt')}</label>
                    <div>
                        <Radio
                            label={t('noTaxExempt')}
                            name='no'
                            value='none'
                            checked={taxExempt === false}
                            onChange={() => { setTaxExempt(!taxExempt);}}
                        />
                        <Radio
                            label={t('yesTaxExempt')}
                            name='yes'
                            value='yes'
                            checked={taxExempt === true}
                            onChange={() => { setTaxExempt(!taxExempt);}}
                            style={{ margin: '0px 10px' }}
                        />
                    </div>
                </div>
                <div className='general-input'>
                    <label>{t('taxIdtype')}</label>
                    <Dropdown selection options={taxIdOptions} defaultValue={taxIdOptions[0].value} style={{ width: '100%' }}
                        onChange={(param, data) => setForm({ ...form, billing: { ...form.billing, tax_id_type: data.value } })}/>
                </div>
                <Header as='h3'>{t('paymentMethod')}</Header>
                <ValidInput
                    label={t('bankName')}
                    name='bankName'
                    placeholder={t('enterBankName')}
                    initialValue={form.payment_methods[0].bank_transfer.bank_name}
                    validFunctions={[minLength]}
                    result={value => setForm({ ...form, payment_methods: [...form.payment_methods].map((el, index) => index === 0
                        ? ({ ...el, bank_transfer: { ...el.bank_transfer, bank_name: value } }) : el) })} />
                <ValidInput
                    label={t('bankAddress')}
                    name='bankAddress'
                    placeholder={t('enterAdress')}
                    initialValue={form.payment_methods[0].bank_transfer.bank_address.street}
                    validFunctions={[minLength]}
                    result={value => setForm({ ...form, payment_methods: [...form.payment_methods].map((el, index) => index === 0
                        ? ({ ...el, bank_transfer: { ...el.bank_transfer, bank_address: { ...el.bank_transfer.bank_address, street: value } } })
                        : el) })} />
                <ValidInput
                    label={t('paymentAccNumber')}
                    name='paymentAccNumber'
                    placeholder={t('enterPaymentAccNumber')}
                    initialValue={form.payment_methods[0].bank_transfer.iban}
                    validFunctions={[minLength]}
                    result={value => setForm({ ...form, payment_methods: [...form.payment_methods].map((el, index) => index === 0
                        ? ({ ...el, bank_transfer: { ...el.bank_transfer, iban: value } }) : el) })} />
                <ValidInput
                    label={t('bic')}
                    name='bic'
                    placeholder={t('enterBic')}
                    initialValue={form.payment_methods[0].bank_transfer.bic}
                    validFunctions={[minLength]}
                    result={value => setForm({ ...form, payment_methods: [...form.payment_methods].map((el, index) => index === 0
                        ? ({ ...el, bank_transfer: { ...el.bank_transfer, bic: value } }) : el) })} />
                <Header as='h3'>{t('billingContact')}</Header>
                <ValidInput
                    label={t('firstName')}
                    name='firstName'
                    placeholder={t('enterFirstName')}
                    initialValue={form.billing.contact.first_name}
                    validFunctions={[required]}
                    result={value => setForm({ ...form, billing: { ...form.billing, contact: { ...form.billing.contact, first_name: value } } })} />
                <ValidInput
                    label={t('lastName')}
                    name='lastName'
                    placeholder={t('enterLastName')}
                    initialValue={form.billing.contact.last_name}
                    validFunctions={[required]}
                    result={value => setForm({ ...form, billing: { ...form.billing, contact: { ...form.billing.contact, last_name: value } } })} />
                <ValidInput
                    label={t('title')}
                    name='title'
                    placeholder={t('enterTitle')}
                    initialValue={form.billing.contact.title}
                    validFunctions={[required]}
                    result={value => setForm({ ...form, billing: { ...form.billing, contact: { ...form.billing.contact, title: value } } })} />
                <ValidInput
                    label={t('email')}
                    name='email'
                    placeholder={t('enterEmail')}
                    initialValue={form.billing.contact.email}
                    validFunctions={[required, email]}
                    result={value => setForm({ ...form, billing: { ...form.billing, contact: { ...form.billing.contact, email: value } } })} />
                <ValidInput
                    label={t('phone')}
                    name='phone'
                    placeholder={t('enterPhone')}
                    initialValue={form.billing.contact.phone}
                    validFunctions={[required, phoneNumber]}
                    result={value => setForm({ ...form, billing: { ...form.billing, contact: { ...form.billing.contact, phone: value } } })} />
            </div>}

        </Form>

        <div className='formActions'>
            <Button
                content={t('cancel')}
                onClick={() => setCreateMode(false)}
            />
            <Button
                onClick={createNewAccount}
                primary
                type='submit'
                content={t('create')}
                disabled={businessType === 'Legal Entity' ? (disabled || disabledForLegal) : disabled }
            />
        </div>
        {accountRegistrationStatus === 'pending' && <Loader active inline='centered' className='charts' />}
    </section>
    );
};

CreateAccount.propTypes = {
    t: PropTypes.func,
    setCreateMode: PropTypes.func,
    updateGrid: PropTypes.func
};

export default CreateAccount;

