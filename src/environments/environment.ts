// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backendEndpoint: 'http://viapos-api-lb-790192954.us-east-1.elb.amazonaws.com:8080',

  // AWS Variables
  region: 'us-east-1',
  identityPoolId: 'us-east-1:304178435682',
  userPoolId: 'us-east-1_uKc7XWNcS',
  clientId: '2send7o4hh4krudqimi3ole82n',
  cognito_idp_endpoint: '',
  cognito_identity_endpoint: '',
  sts_endpoint: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
