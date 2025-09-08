import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Button} from '@rneui/themed';
import CheckBox from '@react-native-community/checkbox';
import {actions, useCart} from '../../../context/cartContext';
import {
  useCreateCheckout,
  useUpdateCheckout,
} from '../../../graphql/hooks/checkout';

const MOCK_DEFAULTS = {
  email: '',
  firstName: 'John',
  lastName: 'Doe',
  phoneCode: '47',
  phone: '21988837',
  address1: 'Storgata 15 A',
  address2: '',
  city: 'Oslo',
  country: 'Norway',
  zip: '0161',
  company: '',
};

export const CheckoutScreen = () => {
  const {
    state: {selectedCountry, checkout, cartId},
    dispatch,
  } = useCart();

  // Prefill with checkout values if present; otherwise mock defaults
  const [email, setEmail] = useState(checkout?.email ?? MOCK_DEFAULTS.email);
  const [firstName, setFirstName] = useState(
    checkout?.billingAddress?.first_name ?? MOCK_DEFAULTS.firstName,
  );
  const [lastName, setLastName] = useState(
    checkout?.billingAddress?.last_name ?? MOCK_DEFAULTS.lastName,
  );
  const [phone, setPhone] = useState(
    (checkout?.billingAddress?.phone ?? MOCK_DEFAULTS.phone) + '',
  );
  const [phoneCode] = useState(
    checkout?.billingAddress?.phoneCode ?? MOCK_DEFAULTS.phoneCode,
  );
  const [address1, setAddress1] = useState(
    checkout?.billingAddress?.address1 ?? MOCK_DEFAULTS.address1,
  );
  const [address2, setAddress2] = useState(
    checkout?.billingAddress?.address2 ?? MOCK_DEFAULTS.address2,
  );
  const [city, setCity] = useState(
    checkout?.billingAddress?.city ?? MOCK_DEFAULTS.city,
  );
  const [country, setCountry] = useState(MOCK_DEFAULTS.country);
  const [countryCode] = useState(selectedCountry);
  const [zipCode, setZipCode] = useState(
    (checkout?.billingAddress?.zip ?? MOCK_DEFAULTS.zip) + '',
  );
  const [company, setCompany] = useState(
    checkout?.billingAddress?.company ?? MOCK_DEFAULTS.company,
  );
  const [acceptsTermsConditions] = useState(true);
  const [acceptsPurchaseConditions] = useState(true);
  const [sameAsBillingAddress, setSameAsBillingAddress] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {createCheckout} = useCreateCheckout();
  const {updateCheckout} = useUpdateCheckout();

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!email) {
      newErrors.email = 'E-mail is required';
      isValid = false;
    }
    if (!firstName) {
      newErrors.firstName = 'Name is required';
      isValid = false;
    }
    if (!lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!phoneCode) {
      newErrors.phoneCode = 'Phone code is required';
      isValid = false;
    }
    if (!phone) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    }
    if (!address1) {
      newErrors.address1 = 'Address Line 1 is required';
      isValid = false;
    }
    if (!country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }
    if (!countryCode) {
      newErrors.countryCode = 'Country code is required';
      isValid = false;
    }
    if (!city) {
      newErrors.city = 'City is required';
      isValid = false;
    }
    if (!zipCode) {
      newErrors.zipCode = 'Zip/Postal Code is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatAddressForMutation = address => {
    return {
      address1: address.address1,
      address2: address.address2,
      city: address.city,
      company: address.company,
      country: country,
      country_code: address.countryCode.toUpperCase(),
      email: email,
      first_name: address.first_name,
      last_name: address.last_name,
      phone: address.phone,
      phone_code: address.phoneCode,
      province: address.province,
      province_code: address.provinceCode,
      zip: address.zip,
    };
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      if (validateForm()) {
        const address = formatAddressForMutation({
          address1,
          address2,
          city,
          company,
          country,
          countryCode,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          phoneCode,
          province: city,
          provinceCode: '',
          zip: zipCode,
        });
        const billingAddress = address;
        const shippingAddress = address;

        const newCheckout = await createCheckout(cartId);

        await updateCheckout(
          newCheckout.id,
          email,
          billingAddress,
          shippingAddress,
          acceptsTermsConditions,
          acceptsPurchaseConditions,
        );

        dispatch({
          type: actions.SET_CHECKOUT_STATE,
          payload: {
            id: newCheckout?.id,
            email,
            billingAddress,
            shippingAddress,
          },
        });

        dispatch({
          type: actions.SET_SELECTED_SCREEN,
          payload: 'Payment',
        });

        console.log('form send successfully');
      } else {
        console.log('Form send errors');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
        />
        <Text style={styles.sectionTitle}>Billing Address</Text>
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        )}
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setFirstName}
          value={firstName}
          placeholder="First Name"
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        )}
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setLastName}
          value={lastName}
          placeholder="Last Name"
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setPhone}
          value={phone}
          placeholder="Phone"
        />
        {errors.address1 && (
          <Text style={styles.errorText}>{errors.address1}</Text>
        )}
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setAddress1}
          value={address1}
          placeholder="Address Line 1"
        />
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setAddress2}
          value={address2}
          placeholder="Address Line 2 (Optional)"
        />
        {errors.country && (
          <Text style={styles.errorText}>{errors.country}</Text>
        )}
        <TextInput
          autoCapitalize="none"
          style={[styles.input, styles.inputDisabled]}
          onChangeText={setCountry}
          value={country}
          placeholder="Country"
          editable={false}
        />
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setCity}
          value={city}
          placeholder="City"
        />
        {errors.zipCode && (
          <Text style={styles.errorText}>{errors.zipCode}</Text>
        )}
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setZipCode}
          value={zipCode}
          placeholder="ZIP/Postal Code"
        />
        <TextInput
          autoCapitalize="none"
          style={styles.input}
          onChangeText={setCompany}
          value={company}
          placeholder="Company (Optional)"
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={sameAsBillingAddress}
            onValueChange={setSameAsBillingAddress}
            disabled={true}
          />
          <Text style={styles.checkboxLabel}>
            Shipping address is the same as billing address
          </Text>
        </View>
        <Text style={styles.summaryText}>
          By proceeding with this checkout, you automatically agree to our Terms
          and Conditions and Purchase Conditions. These conditions are designed
          to ensure a smooth transaction and clarify the responsibilities and
          rights of all parties involved.
        </Text>
        <View style={styles.checkboxContainer}>
          <CheckBox disabled value={acceptsTermsConditions} />
          <Text style={styles.checkboxLabel}>Accept Terms and Conditions</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox disabled value={acceptsPurchaseConditions} />
          <Text style={styles.checkboxLabel}>Accept Purchase Conditions</Text>
        </View>
        <Button
          title="Submit Order"
          onPress={submitForm}
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitButtonText}
        />
      </ScrollView>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 12,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
