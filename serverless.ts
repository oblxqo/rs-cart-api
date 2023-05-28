import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'cart-service',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: [
    'serverless-offline',
    'serverless-dotenv-plugin'
  ],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    stage: 'dev',
    profile: 'dev-sandx-profile',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PG_HOST: '${env:PG_HOST}',
      PG_PORT: '${env:PG_PORT}',
      PG_DATABASE: '${env:PG_DATABASE}',
      PG_USERNAME: '${env:PG_USERNAME}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
    },
  },
  functions: {
    main: {
      handler: 'dist/src/main.handler',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/',
          },
        },
        {
          http: {
            method: 'ANY',
            path: '{proxy+}',
          }
        }
      ],
    }
  },
  package: {
    individually: true,
    excludeDevDependencies: true,
  }
};

module.exports = serverlessConfiguration;