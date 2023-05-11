import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "nav-links-component",

  initialize() {
    withPluginApi("0.8", (api) => {
      const itemsSetting = settings.Nav_links;
      const items = itemsSetting.split("|").map((item) => item.trim());

      for (const item of items) {
        const splitSec = item.split(";").map((section) => section.trim());
        const filter = splitSec[0].replace(/\s+/g, "-").toLowerCase();
        const title = splitSec[1];
        const location = splitSec[2];

        api.addNavigationBarItem({
          name: `custom_${filter}`,
          displayName: filter,
          title,
          href: location,
          forceActive: (category, args, router) =>
            router.currentURL.includes(location),
        });
      }
    });
  },
};
