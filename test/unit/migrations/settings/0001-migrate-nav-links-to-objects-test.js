import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0001-migrate-nav-links-to-objects";

module(
  "Custom Top Navigation Links | Migrations | Settings | 0001-migrate-nav-links-to-objects",
  function () {
    test("does nothing when the old setting is not present", function (assert) {
      const settings = new Map(Object.entries({ Hide_dropdowns: true }));

      const result = migrate(settings);

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(new Map(Object.entries({ Hide_dropdowns: true })))
      );
    });

    test("migrate when value of setting is already an array", function (assert) {
      const links = [
        {
          display_name: "Latest",
          title: "topics with recent posts",
          url: "/latest",
        },
      ];
      const settings = new Map(Object.entries({ Nav_links: links }));

      const result = migrate(settings);

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(new Map(Object.entries({ nav_links: links })))
      );
    });

    test("migrate when old setting value is an empty string", function (assert) {
      const settings = new Map(Object.entries({ Nav_links: "" }));

      const result = migrate(settings);

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(new Map(Object.entries({ nav_links: [] })))
      );
    });

    test("migrate when old setting value is invalid", function (assert) {
      const settings = new Map(
        Object.entries({
          Nav_links: "Missing URL|Missing URL 2;some title|;;/no-name",
        })
      );

      const result = migrate(settings);

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(new Map(Object.entries({ nav_links: [] })))
      );
    });

    test("migrate when title is not provided", function (assert) {
      const settings = new Map(
        Object.entries({
          Nav_links: "External link;;https://meta.discourse.org",
        })
      );

      const result = migrate(settings);

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(
          new Map(
            Object.entries({
              nav_links: [
                {
                  display_name: "External link",
                  url: "https://meta.discourse.org",
                },
              ],
            })
          )
        )
      );
    });

    test("migrate", function (assert) {
      const settings = new Map(
        Object.entries({
          Nav_links:
            "Latest;topics with recent posts;/latest|Categories;all topics grouped by category;/categories|Top;the most active topics in the last year, month, week or day;/top",
        })
      );

      const result = migrate(settings);

      assert.deepEqual(
        Object.fromEntries(result.entries()),
        Object.fromEntries(
          new Map(
            Object.entries({
              nav_links: [
                {
                  display_name: "Latest",
                  title: "topics with recent posts",
                  url: "/latest",
                },
                {
                  display_name: "Categories",
                  title: "all topics grouped by category",
                  url: "/categories",
                },
                {
                  display_name: "Top",
                  title:
                    "the most active topics in the last year, month, week or day",
                  url: "/top",
                },
              ],
            })
          )
        )
      );
    });
  }
);
