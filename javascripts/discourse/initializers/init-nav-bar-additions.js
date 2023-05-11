import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "nav-links-component",
  initialize() {
    withPluginApi("0.8", (api) => {
      const nmlt = settings.Nav_links,
        sec = nmlt.split("|").map(function (item) {
          return item.trim();
        });

      sec.forEach(function (value) {
        const sec = value.split(";").map(function (item) {
            return item.trim();
          }),
          filter = sec[0].replace(/\s+/g, "-").toLowerCase(),
          title = sec[1],
          location = sec[2];

        api.addNavigationBarItem({
          name: `custom_${filter}`,
          displayName: filter,
          title: title,
          href: location,
          forceActive: (category, args, router) => {
            return router.currentURL.includes(location);
          },
        });
      });
    });
  },
};
