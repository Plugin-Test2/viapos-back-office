export const AwsConfig = {

  // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
  identityPoolId: 'us-east-1:304178435682',

    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'us-east-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_uKc7XWNcS',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2send7o4hh4krudqimi3ole82n',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    cookieStorage: {
    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    domain: 'gymii.com',
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 365,
      // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      sameSite: 'strict',
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
      secure: true
  },

  // OPTIONAL - customized storage object
  // storage: MyStorage,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH',

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    clientMetadata: { myCustomKey: 'myCustomValue' },

  // OPTIONAL - Hosted UI configuration
  oauth: {
    domain: 'gymii',
      scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: 'http://localhost:4200/',
      redirectSignOut: 'http://localhost:4200/',
      responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
  }
}
