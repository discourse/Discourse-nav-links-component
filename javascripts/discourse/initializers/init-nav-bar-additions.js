import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "nav-links-component",

  initialize() {
    withPluginApi((api) => {
      for (const {
        display_name: displayName,
        title,
        url,
      } of settings.nav_links) {
        api.addNavigationBarItem({
          name: `custom_${displayName.replace(/\s+/g, "-").toLowerCase()}`,
          displayName,
          title,
          href: url,
          forceActive: (category, args, router) =>
            router.currentURL?.split("?")[0] === url,
        });
      }
    });
  },
};
