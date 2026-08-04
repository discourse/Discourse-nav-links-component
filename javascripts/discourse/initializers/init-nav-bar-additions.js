import { withPluginApi } from "discourse/lib/plugin-api";
import I18n from "I18n";

/**
 * Resolve a field value from a nav link, checking for a locale-specific
 * translation first. Falls back to the base field value.
 */
function getLocalizedField(link, fieldName) {
  const translations = link.translations;
  if (!translations || translations.length === 0) {
    return link[fieldName];
  }

  const locale = I18n.currentLocale();

  // Try exact match first (e.g. "pt_BR"), then prefix match (e.g. "pt")
  const match =
    translations.find((t) => t.locale === locale) ||
    translations.find((t) => locale.startsWith(t.locale));

  return (match && match[fieldName]) || link[fieldName];
}

// Built-in Discourse filter routes that have associated topic counts
const COUNTED_FILTERS = {
  "/new": "new",
  "/unread": "unread",
};

function getCountForFilter(
  topicTrackingState,
  filterType,
  { enable_unified_new }
) {
  if (!topicTrackingState) {
    return 0;
  }

  const newCount =
    topicTrackingState.countNew?.() ?? topicTrackingState.newCount ?? 0;
  const unreadCount =
    topicTrackingState.countUnread?.() ?? topicTrackingState.unreadCount ?? 0;

  if (filterType === "new") {
    // When Discourse's "Unified New" is enabled, the /new route shows both
    // new and unread topics, so the count should reflect both — matching
    // the behaviour of Discourse's built-in "New" navigation item.
    if (enable_unified_new) {
      return newCount + unreadCount;
    }
    return newCount;
  }

  if (filterType === "unread") {
    return unreadCount;
  }

  return 0;
}

export default {
  name: "nav-links-component",

  initialize() {
    withPluginApi((api) => {
      const topicTrackingState = api.container.lookup(
        "service:topic-tracking-state"
      );
      const siteSettings = api.container.lookup("service:site-settings");

      for (const link of settings.nav_links) {
        const { display_name: displayName, url } = link;
        const localizedDisplayName = getLocalizedField(link, "display_name");
        const localizedTitle = getLocalizedField(link, "title");
        const filterType = COUNTED_FILTERS[url];
        const itemConfig = {
          name: `custom_${displayName.replace(/\s+/g, "-").toLowerCase()}`,
          title: localizedTitle,
          href: url,
          forceActive: (category, args, router) =>
            router.currentURL?.split("?")[0] === url,
        };

        if (settings.Show_counts && filterType && topicTrackingState) {
          // Use a function for displayName so Discourse re-evaluates it
          // reactively, picking up count changes from TopicTrackingState.
          itemConfig.displayName = () => {
            const count = getCountForFilter(topicTrackingState, filterType, {
              enable_unified_new: siteSettings.enable_unified_new,
            });
            return count > 0
              ? `${localizedDisplayName} (${count})`
              : localizedDisplayName;
          };
        } else {
          itemConfig.displayName = localizedDisplayName;
        }

        api.addNavigationBarItem(itemConfig);
      }
    });
  },
};
