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
import {useUpdateCart} from '../../../graphql/hooks/cart';
import {
  useCreateCheckout,
  useUpdateCheckout,
} from '../../../graphql/hooks/checkout';
import {useUpdateItemToCart} from '../../../graphql/hooks/cartItem';

export const CheckoutScreen = () => {
  const {
    state: {selectedCountry, checkout, cartId, cartItems, selectedCurrency},
    dispatch,
  } = useCart();

  const [email, setEmail] = useState(checkout?.email ?? '');
  const [firstName, setFirstName] = useState(
    checkout?.billingAddress?.first_name ?? '',
  );
  const [lastName, setLastName] = useState(
    checkout?.billingAddress?.last_name ?? '',
  );
  const [phone, setPhone] = useState(
    (checkout?.billingAddress?.phone ?? '') + '',
  );
  const [phoneCode] = useState(checkout?.billingAddress?.phoneCode ?? '+47');
  const [address1, setAddress1] = useState(
    checkout?.billingAddress?.address1 ?? '',
  );
  const [address2, setAddress2] = useState(
    checkout?.billingAddress?.address2 ?? '',
  );
  const [city, setCity] = useState(checkout?.billingAddress?.city ?? '');
  const [country, setCountry] = useState('Norway');
  const [countryCode] = useState(selectedCountry);
  const [zipCode, setZipCode] = useState(
    (checkout?.billingAddress?.zip ?? '') + '',
  );
  const [company, setCompany] = useState(
    checkout?.billingAddress?.company ?? '',
  );
  const [sameAsBillingAddress, setSameAsBillingAddress] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const {executeUpdateCart} = useUpdateCart();

  const {createCheckout} = useCreateCheckout();

  const {updateCheckout} = useUpdateCheckout();

  const {updateItemToCart} = useUpdateItemToCart();

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
      phone: +address.phone,
      phone_code: address.phoneCode,
      province: address.province,
      province_code: address.provinceCode,
      zip: address.zip,
    };
  };

  const findShippingCountryId = (
    _countryCode,
    _currencyCode,
    productShipping,
  ) => {
    if (!productShipping) {
      return null;
    }

    for (let shippingInfo of productShipping) {
      let shippingCountries = shippingInfo.shipping_country;
      if (shippingCountries) {
        for (const _country of shippingCountries) {
          const countryInfo = _country;

          if (
            countryInfo.country.toUpperCase() === _countryCode.toUpperCase() &&
            countryInfo.currency_code.toUpperCase() ===
              _currencyCode.toUpperCase()
          ) {
            return countryInfo.id;
          }
        }
      }
    }

    return null;
  };

  const submitForm = async () => {
    try {
      setIsLoading(true);
      if (validateForm()) {
        const address = formatAddressForMutation({
          address1: address1,
          address2: address2,
          city: city,
          company: company,
          country: country,
          countryCode: countryCode,
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          phoneCode: phoneCode,
          province: city,
          provinceCode: '',
          zip: zipCode,
        });
        const billingAddress = address;
        const shippingAddress = address;

        // Update the cart mutation with the country of shipment.
        await executeUpdateCart(cartId, selectedCountry);

        // Iterate over the items in the cart and update them if necessary.
        for (const cartItem of cartItems) {
          const countryId = await findShippingCountryId(
            countryCode,
            selectedCurrency,
            cartItem.productShipping,
          );
          if (countryId != null) {
            await updateItemToCart(
              cartId,
              cartItem.cartItemId,
              null,
              countryId,
            );
          } else {
            console.error(
              `Country id could not be found for the cart item with id: ${cartItem.cartItemId}`,
            );
          }
        }

        const newCheckout = await createCheckout(cartId);

        await updateCheckout(
          newCheckout.id,
          email,
          billingAddress,
          shippingAddress,
        );

        dispatch({
          type: actions.SET_CHECKOUT_STATE,
          payload: {
            id: newCheckout?.id,
            email: email,
            billingAddress: billingAddress,
            shippingAddress: shippingAddress,
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
});
