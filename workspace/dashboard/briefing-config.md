# Morning Briefing Config

- schedule: `0 8 * * *`
- timezone: `America/Montevideo`
- target channel: `telegram`
- telegram target: 2017549847  <!-- e.g., @username or numeric chat id -->
- enabled: `true`

If `telegram target` is not set, briefing run should log the issue and skip send.
