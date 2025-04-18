const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");
module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          maintainer: "Your Name <you@example.com>",
          homepage: "https://yourapp.com",
          categories: ["Utility"],
        },
      },
    },
  ],
};
