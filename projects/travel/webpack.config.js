const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'travel',

  exposes: {
    './routes': './projects/travel/src/app/features/travel/travel.routes.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
    "auth-lib": { singleton: true, strictVersion: true }
  },

});
