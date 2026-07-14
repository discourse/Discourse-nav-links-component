export default function migrate(settings) {
  if (!settings.has("Nav_links")) {
    return settings;
  }

  const oldValue = settings.get("Nav_links");
  settings.delete("Nav_links");

  if (Array.isArray(oldValue)) {
    settings.set("nav_links", oldValue);
    return settings;
  }

  if (typeof oldValue === "string") {
    const newLinks = [];

    oldValue.split("|").forEach((link) => {
      const [displayName, title, url] = link
        .split(";")
        .map((section) => section.trim());

      if (displayName && url) {
        const newLink = { display_name: displayName, url };

        if (title) {
          newLink.title = title;
        }

        newLinks.push(newLink);
      }
    });

    settings.set("nav_links", newLinks);
  }

  return settings;
}
