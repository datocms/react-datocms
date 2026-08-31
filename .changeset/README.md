# Changesets

This folder holds the pending release notes for the next version.

Whenever you change something worth mentioning in a release, run `npx changeset`
and answer the two prompts (which packages, and whether it's a patch/minor/major).
That writes a small markdown file here, which you commit along with your changes.

At release time `npm run release` consumes every pending file: it computes the
resulting versions, updates the `package.json`s and the `CHANGELOG.md`s, and
deletes the files.

## Which bump level?

- `patch` — bug fixes only. It's the clearest signal in semver ("nothing new,
  just a fix"), so we don't spend it on anything else.
- `minor` — new public API surface.
- `major` — public API was removed or renamed.

## Prereleases

`npm run release:next` publishes under the `next` dist-tag, leaving `latest`
untouched. It works in two modes:

- **as-is** — the pending changesets produce a normal version (say `4.1.0`)
  which is published under `next` instead of `latest`;
- **real prerelease versions** — run `npx changeset pre enter next` first and
  the same command produces `4.1.0-next.0`, `4.1.0-next.1`, … That mode is
  recorded in `.changeset/pre.json`, which you commit. Run
  `npx changeset pre exit` when the line is done.

Either way the GitHub release is marked as a prerelease, so it never becomes
the repository's "Latest release".

`npm run release` refuses to run while `.changeset/pre.json` exists, so a
forgotten pre mode can't quietly turn a real release into a prerelease.
