import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "nav-links-component",
  initialize() {
    withPluginApi("0.8", (api) => {
      const itemsSetting = settings.Nav_links,
        items = itemsSetting.split("|").map(function (item) {
          return item.trim();
        });

      items.forEach(function (item) {
        const splitSec = item.split(";").map(function (section) {
            return section.trim();
          }),
          filter = splitSec[0].replace(/\s+/g, "-").toLowerCase(),
          title = splitSec[1],
          location = splitSec[2];

        api.addNavigationBarItem({
          name: `custom_${filter}`,
          displayName: filter,
          title,
          href: location,
          forceActive: (category, args, router) => {
            return router.currentURL.includes(location);
          },
        });
      });
    });
  },
};
