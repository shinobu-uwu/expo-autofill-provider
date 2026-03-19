import {
  AndroidConfig,
  type ConfigPlugin,
  withAndroidManifest,
  withGradleProperties,
} from '@expo/config-plugins';

const withAutofillProvider: ConfigPlugin = (config) => {
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );
    const service = mainApplication.service ?? [];
    service.push({
      $: {
        'android:name': 'expo.modules.autofillprovider.AutofillProviderService',
        'android:permission': 'android.permission.BIND_AUTOFILL_SERVICE',
        'android:exported': 'true',
      },
      'intent-filter': [
        {
          action: [
            {
              $: { 'android:name': 'android.service.autofill.AutofillService' },
            },
          ],
        },
      ],
    });
    mainApplication.service = service;

    return config;
  });
  config = withGradleProperties(config, (config) => {
    const index = config.modResults.findIndex(
      (item) =>
        item.type === 'property' && item.key === 'android.minSdkVersion',
    );

    if (index === -1) {
      config.modResults.push({
        type: 'property',
        key: 'android.minSdkVersion',
        value: '26',
      });
    } else {
      const result = config.modResults[index];

      if (result.type !== 'property') {
        // should never happen since we are checking the type in findIndex, but
        // just to satisfy TypeScript that result is a property and has a value
        throw new Error(
          `Expected "android.minSdkVersion" to be a property, but found a ${result.type}`,
        );
      }

      const currentVal = parseInt(result.value, 10);

      if (currentVal < 26) {
        result.value = '26';
      }
    }

    return config;
  });

  return config;
};

export default withAutofillProvider;
