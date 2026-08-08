# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> homepage has no automatic accessibility violations
- Location: tests\e2e\accessibility.spec.ts:5:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  -   1
+ Received  + 186

- Array []
+ Array [
+   Object {
+     "description": "Ensure buttons have discernible text",
+     "help": "Buttons must have discernible text",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.12/button-name?application=playwright",
+     "id": "button-name",
+     "impact": "critical",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": null,
+             "id": "button-has-visible-text",
+             "impact": "critical",
+             "message": "Element does not have inner text that is visible to screen readers",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-label",
+             "impact": "critical",
+             "message": "aria-label attribute does not exist or is empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "aria-labelledby",
+             "impact": "critical",
+             "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": Object {
+               "messageKey": "noAttr",
+             },
+             "id": "non-empty-title",
+             "impact": "critical",
+             "message": "Element has no title attribute",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "implicit-label",
+             "impact": "critical",
+             "message": "Element does not have an implicit (wrapped) <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "explicit-label",
+             "impact": "critical",
+             "message": "Element does not have an explicit <label>",
+             "relatedNodes": Array [],
+           },
+           Object {
+             "data": null,
+             "id": "presentational-role",
+             "impact": "critical",
+             "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+             "relatedNodes": Array [],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element does not have inner text that is visible to screen readers
+   aria-label attribute does not exist or is empty
+   aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
+   Element has no title attribute
+   Element does not have an implicit (wrapped) <label>
+   Element does not have an explicit <label>
+   Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"",
+         "html": "<button type=\"button\" tabindex=\"0\" data-slot=\"button\" class=\"group/button inline-...\">",
+         "impact": "critical",
+         "none": Array [],
+         "target": Array [
+           ".dark\\:hover\\:bg-muted\\/50.in-data-\\[slot\\=button-group\\]\\:rounded-lg.aria-expanded\\:bg-muted",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.name-role-value",
+       "wcag2a",
+       "wcag412",
+       "section508",
+       "section508.22.a",
+       "TTv5",
+       "TT6.a",
+       "EN-301-549",
+       "EN-9.4.1.2",
+       "ACT",
+       "RGAAv4",
+       "RGAA-11.9.1",
+     ],
+   },
+   Object {
+     "description": "Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
+     "help": "Elements must meet minimum color contrast ratio thresholds",
+     "helpUrl": "https://dequeuniversity.com/rules/axe/4.12/color-contrast?application=playwright",
+     "id": "color-contrast",
+     "impact": "serious",
+     "nodes": Array [
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ff2939",
+               "contrastRatio": 3.63,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#fcfcfc",
+               "fontSize": "9.6pt (12.8px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.63 (foreground color: #fcfcfc, background color: #ff2939, font size: 9.6pt (12.8px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"button\" tabindex=\"0\" data-slot=\"button\" class=\"group/button inline-...\">",
+                 "target": Array [
+                   ".gap-2.flex > .bg-primary.text-primary-foreground.hover\\:bg-primary\\/80",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.63 (foreground color: #fcfcfc, background color: #ff2939, font size: 9.6pt (12.8px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<button type=\"button\" tabindex=\"0\" data-slot=\"button\" class=\"group/button inline-...\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".gap-2.flex > .bg-primary.text-primary-foreground.hover\\:bg-primary\\/80",
+         ],
+       },
+       Object {
+         "all": Array [],
+         "any": Array [
+           Object {
+             "data": Object {
+               "bgColor": "#ff2939",
+               "contrastRatio": 3.63,
+               "expectedContrastRatio": "4.5:1",
+               "fgColor": "#fcfcfc",
+               "fontSize": "10.5pt (14px)",
+               "fontWeight": "normal",
+               "messageKey": null,
+             },
+             "id": "color-contrast",
+             "impact": "serious",
+             "message": "Element has insufficient color contrast of 3.63 (foreground color: #fcfcfc, background color: #ff2939, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+             "relatedNodes": Array [
+               Object {
+                 "html": "<button type=\"submit\" tabindex=\"0\" data-slot=\"button\" class=\"group/button inline-...\">",
+                 "target": Array [
+                   ".h-9",
+                 ],
+               },
+             ],
+           },
+         ],
+         "failureSummary": "Fix any of the following:
+   Element has insufficient color contrast of 3.63 (foreground color: #fcfcfc, background color: #ff2939, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1",
+         "html": "<button type=\"submit\" tabindex=\"0\" data-slot=\"button\" class=\"group/button inline-...\">",
+         "impact": "serious",
+         "none": Array [],
+         "target": Array [
+           ".h-9",
+         ],
+       },
+     ],
+     "tags": Array [
+       "cat.color",
+       "wcag2aa",
+       "wcag143",
+       "TTv5",
+       "TT13.c",
+       "EN-301-549",
+       "EN-9.1.4.3",
+       "ACT",
+       "RGAAv4",
+       "RGAA-3.2.1",
+     ],
+   },
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - button "Search drivers, circuits, races" [ref=e5]:
        - generic [ref=e6]: Search F1
        - generic [ref=e7]: ⌘K
      - generic [ref=e8]:
        - heading "Search Pole Position" [level=2] [ref=e9]
        - paragraph [ref=e10]: Search drivers, circuits, constructors, races, countries and seasons.
      - button "Open settings" [ref=e11]
    - generic [ref=e14]:
      - generic [ref=e19]:
        - paragraph [ref=e20]: We detected your timezone as Asia/Dhaka
        - paragraph [ref=e21]: Want to use it for all race times?
      - generic [ref=e22]:
        - button "Use Dhaka" [ref=e23]
        - button [ref=e24]
    - generic [ref=e26]:
      - generic [ref=e27]: UPCOMING
      - generic [ref=e32]:
        - img "United Kingdom flag" [ref=e33]
        - heading "Silverstone Circuit" [level=2] [ref=e34]
      - img "silverstone circuit layout" [ref=e36]
      - heading "British Grand Prix" [level=1] [ref=e38]
      - paragraph [ref=e39]: R · Jul 05, 2026 at 20:00 Asia/Dhaka
      - timer "0 days 0 hours 0 minutes 0 seconds until session" [ref=e41]:
        - generic [ref=e42]:
          - generic [ref=e43]: "00"
          - generic [ref=e45]: Days
        - generic [ref=e46]: ":"
        - generic [ref=e47]:
          - generic [ref=e48]: "00"
          - generic [ref=e50]: Hours
        - generic [ref=e51]: ":"
        - generic [ref=e52]:
          - generic [ref=e53]: "00"
          - generic [ref=e55]: Min
        - generic [ref=e56]: ":"
        - generic [ref=e57]:
          - generic [ref=e58]: "00"
          - generic [ref=e60]: Sec
    - generic [ref=e64]:
      - generic [ref=e66]:
        - generic [ref=e67]:
          - heading "Weekend Timeline" [level=2] [ref=e68]
          - paragraph [ref=e69]: All sessions at British Grand Prix — shown in your local time (Silverstone Circuit).
        - generic [ref=e70]:
          - generic [ref=e72]:
            - generic [ref=e73]:
              - generic [ref=e74]: FP1
              - generic [ref=e75]: Done
            - generic [ref=e76]:
              - generic [ref=e77]: 16:00
              - generic [ref=e78]: Asia/Dhaka
            - generic [ref=e79]: 50493m ago
          - generic [ref=e83]:
            - generic [ref=e84]:
              - generic [ref=e85]: R
              - generic [ref=e86]: Done
            - generic [ref=e87]:
              - generic [ref=e88]: 20:00
              - generic [ref=e89]: Asia/Dhaka
            - generic [ref=e90]: 47373m ago
        - generic [ref=e92]:
          - generic [ref=e93]: Upcoming
          - generic [ref=e95]: Live
          - generic [ref=e97]: Finished
      - generic [ref=e100]:
        - generic [ref=e101]:
          - heading "Season Calendar" [level=2] [ref=e102]
          - paragraph [ref=e103]: The full race calendar — every session converted to your timezone (Asia/Dhaka).
        - generic [ref=e104]:
          - group "Filter by status" [ref=e105]:
            - button "All races" [pressed] [ref=e106]: All
            - button "Upcoming races" [ref=e107]: Upcoming
            - button "Finished races" [ref=e108]: Finished
          - generic [ref=e109]:
            - button "All" [ref=e110]
            - button "Jul" [ref=e111]
        - generic [ref=e114]:
          - generic [ref=e115]:
            - img "United Kingdom flag" [ref=e116]
            - generic [ref=e117]: "01"
          - heading "British Grand Prix" [level=3] [ref=e118]
          - paragraph [ref=e119]: Silverstone Circuit
          - generic [ref=e120]:
            - generic [ref=e121]: Jul 05, 2026
            - generic [ref=e122]:
              - generic [ref=e123]: 06:00
              - generic [ref=e124]: Finished
      - region "Circuit explorer. Use arrow keys to change circuit." [ref=e125]:
        - generic [ref=e126]:
          - generic [ref=e127]:
            - heading "Circuit Explorer" [level=2] [ref=e128]
            - paragraph [ref=e129]: Track layout draws in as you scroll. Corner markers, DRS zones and records — browse with the keyboard.
          - generic [ref=e130]:
            - button "Monte Carlo" [ref=e131]
            - button "Silverstone" [ref=e132]
            - button "Suzuka" [ref=e133]
            - button "Spa" [ref=e134]
            - button "Monza" [pressed] [ref=e135]
            - button "Sakhir" [ref=e136]
          - generic [ref=e137]:
            - generic [ref=e138]:
              - img "Autodromo Nazionale Monza circuit layout" [ref=e139]:
                - generic [ref=e143]: "1"
                - generic [ref=e152]: "5"
                - generic [ref=e161]: "9"
              - generic [ref=e168]:
                - generic [ref=e169]: DRS zone
                - generic [ref=e171]: Corner
                - generic [ref=e173]: ← → to switch
            - generic [ref=e174]:
              - generic [ref=e175]:
                - img "Italy flag" [ref=e176]
                - generic [ref=e177]:
                  - heading "Autodromo Nazionale Monza" [level=3] [ref=e178]
                  - paragraph [ref=e179]: Monza · Italy
              - generic [ref=e180]:
                - generic [ref=e182]:
                  - generic [ref=e183]: Lap record
                  - generic [ref=e184]: 1:21.046
                  - generic [ref=e185]: Rubens Barrichello
                - generic [ref=e187]:
                  - generic [ref=e188]: Race distance
                  - generic [ref=e189]: 53 laps
                  - generic [ref=e190]: 5.793 km
                - generic [ref=e192]:
                  - generic [ref=e193]: Corners
                  - generic [ref=e194]: "11"
                  - generic [ref=e195]: GP layout
                - generic [ref=e197]:
                  - generic [ref=e198]: DRS zones
                  - generic [ref=e199]: "2"
                  - generic [ref=e200]: activate on straights
              - generic [ref=e202]:
                - generic [ref=e203]:
                  - generic [ref=e204]: First Grand Prix
                  - generic [ref=e205]: "1950"
                - generic [ref=e206]: F1 Circuit
      - generic [ref=e208]:
        - generic [ref=e209]:
          - heading "Championship" [level=2] [ref=e210]
          - paragraph [ref=e211]: Current drivers' and constructors' championship standings.
        - generic [ref=e212]:
          - generic [ref=e213]:
            - heading "Drivers" [level=3] [ref=e215]
            - generic [ref=e217]:
              - generic [ref=e218]: "1"
              - generic [ref=e219]:
                - generic [ref=e221]: Max Verstappen
                - generic [ref=e222]: Red Bull
              - generic [ref=e223]:
                - generic [ref=e224]: 1W
                - generic [ref=e225]: "25"
          - generic [ref=e226]:
            - heading "Constructors" [level=3] [ref=e228]
            - generic [ref=e230]:
              - generic [ref=e231]: "1"
              - generic [ref=e232]: Red Bull
              - generic [ref=e235]:
                - generic [ref=e236]: 1W
                - generic [ref=e237]: "25"
      - generic [ref=e239]:
        - generic [ref=e240]:
          - generic [ref=e241]:
            - heading "Race Control" [level=2] [ref=e242]
            - paragraph [ref=e243]: Flags, safety-car calls and timing messages as they happen.
          - generic [ref=e244]: NO LIVE SESSION
        - generic [ref=e248]:
          - generic [ref=e249]: 🏁
          - paragraph [ref=e250]: No live session right now. The race-control feed appears when a session goes live.
          - paragraph [ref=e251]: "Current weekend state: upcoming"
      - generic [ref=e253]:
        - generic [ref=e254]:
          - generic [ref=e255]:
            - heading "Tyre Strategy" [level=2] [ref=e256]
            - paragraph [ref=e257]: Live stint-by-stint compound history per driver.
          - generic [ref=e258]: NO LIVE SESSION
        - generic [ref=e262]:
          - generic [ref=e263]: 🛞
          - paragraph [ref=e264]: No live session right now. Tyre stints appear when a session is live.
      - generic [ref=e266]:
        - generic [ref=e267]:
          - generic [ref=e268]:
            - heading "Weather" [level=2] [ref=e269]
            - paragraph [ref=e270]: Forecast for Silverstone Circuit — 3-hour steps.
          - generic [ref=e271]: FORECAST
        - generic [ref=e276]:
          - generic [ref=e277]: 🌤️
          - paragraph [ref=e278]: Weather data unavailable right now.
      - generic [ref=e280]:
        - generic [ref=e281]:
          - heading "Comparison" [level=2] [ref=e282]
          - paragraph [ref=e283]: Head-to-head against championship standings.
        - generic [ref=e284]:
          - button "Drivers" [ref=e285]
          - button "Constructors" [ref=e286]
        - generic [ref=e287]:
          - generic [ref=e288]:
            - heading "Side A" [level=3] [ref=e289]
            - button "verstappen" [ref=e292]
          - generic [ref=e293]:
            - heading "Side B" [level=3] [ref=e294]
            - button "verstappen" [ref=e297]
        - paragraph [ref=e299]: Pick one driver on each side to compare.
      - generic [ref=e301]:
        - generic [ref=e302]:
          - heading "Results" [level=2] [ref=e303]
          - paragraph [ref=e304]: Race, qualifying and sprint classifications for each round of the season.
        - generic [ref=e305]:
          - generic [ref=e306]:
            - button "Race" [ref=e307]
            - button "Qualifying" [ref=e308]
            - button "Sprint" [ref=e309]
          - generic [ref=e310]: R1 · British Grand Prix
        - button "R1" [ref=e312]
        - paragraph [ref=e314]: No race data available for round 1.
      - generic [ref=e316]:
        - generic [ref=e317]:
          - generic [ref=e318]:
            - heading "Statistics" [level=2] [ref=e319]
            - paragraph [ref=e320]: Season-long fastest laps and championship points progression.
          - generic [ref=e321]:
            - button "2026" [ref=e322]
            - button "2025" [ref=e323]
            - button "2024" [ref=e324]
        - generic [ref=e325]: Statistics unavailable for 2026.
      - paragraph [ref=e328]: Season timeline unavailable for 2026.
      - generic [ref=e330]:
        - generic [ref=e331]:
          - generic [ref=e332]:
            - heading "History" [level=2] [ref=e333]
            - paragraph [ref=e334]: Season winners and fastest-lap track records.
          - generic [ref=e335]:
            - button "2026" [ref=e336]
            - button "2025" [ref=e337]
            - button "2024" [ref=e338]
        - generic [ref=e339]:
          - generic [ref=e340]:
            - heading "Race Winners — 2025" [level=3] [ref=e341]
            - paragraph [ref=e343]: No results yet for 2025.
          - generic [ref=e344]:
            - heading "Track Records" [level=3] [ref=e345]
            - paragraph [ref=e346]: Fastest race lap per circuit across 2024–2026.
            - paragraph [ref=e348]: Records unavailable right now.
      - generic [ref=e351]:
        - generic [ref=e352]:
          - heading "Race reminders, straight to your inbox" [level=2] [ref=e353]
          - paragraph [ref=e354]: Sign up for session reminders across the entire F1 calendar. Choose when you want the heads-up — a day before, a few hours out, or right at the 15-minute mark — and we'll ping you before every green light. Unsubscribe in one click, any time.
          - list [ref=e355]:
            - listitem [ref=e356]: Sessions for the full season calendar
            - listitem [ref=e358]: Per-session reminder windows you control
            - listitem [ref=e360]: One-click unsubscribe, no spam
        - generic [ref=e362]:
          - generic [ref=e363]: Email reminders
          - heading "Never miss a green light" [level=3] [ref=e369]
          - paragraph [ref=e370]: Get a heads-up before every F1 session. Pick your windows, hit subscribe, and we'll handle the rest — no spam, ever.
          - generic [ref=e371]:
            - generic [ref=e372]:
              - text: Email address
              - textbox "Email address" [ref=e373]:
                - /placeholder: you@example.com
            - generic [ref=e374]:
              - text: Remind me
              - generic [ref=e375]:
                - button "15 minutes before" [ref=e376]
                - button "1 hour before" [pressed] [ref=e377]
                - button "12 hours before" [ref=e380]
                - button "24 hours before" [pressed] [ref=e381]
            - button "Subscribe" [ref=e384]
  - button "Open Next.js Dev Tools" [ref=e390] [cursor=pointer]
  - alert [ref=e394]
```

# Test source

```ts
  1  | import AxeBuilder from "@axe-core/playwright";
  2  | import { expect, test } from "@playwright/test";
  3  | import { mockApi } from "./fixtures";
  4  | 
  5  | test("homepage has no automatic accessibility violations", async ({ page }) => {
  6  |   await mockApi(page);
  7  |   await page.goto("/");
  8  | 
  9  |   await expect(
  10 |     page.getByRole("heading", { level: 1, name: /British Grand Prix/i })
  11 |   ).toBeVisible();
  12 | 
  13 |   const results = await new AxeBuilder({ page }).analyze();
  14 | 
> 15 |   expect(results.violations).toEqual([]);
     |                              ^ Error: expect(received).toEqual(expected) // deep equality
  16 | });
  17 | 
```