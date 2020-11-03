export interface EnvironmentInterface {
  production: boolean;
  settings: {
    endpoint: string;
    apiv2: string;
    firebase: {
      apiKey: string;
      authDomain: string;
      databaseURL: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
      measurementId: string;
    };
    tracing_api: string;
  };
}
