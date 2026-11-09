<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Imported app structure
- Preserve the target TanStack runtime and pinned framework dependencies; import the library routes, static catalog shards, and local media independently so repository imports do not replace hosting infrastructure.
- Keep the educational resource catalog static and publicly readable; the source has no database or account workflow.
- Keep homepage shelf assignments in a static data module so class grouping and ordering can be tested independently of presentation.
- Keep home-screen support manifest-only unless offline use is explicitly requested; native install eligibility gates Chromium offers and Safari has manual guidance.
- Track visible browsing time in session storage and installation evidence in local storage so navigation does not restart the offer delay and completed installs suppress future offers.
- Generate document overviews, quick facts and search metadata through one browser-safe static-catalog helper; omit unknown facts and avoid claims about file contents, pricing or curriculum not supported by the record.
- Keep document information presentation separate from search descriptions and pass measured file size into it; this allows collapsible labelled facts without changing catalog indexing or fetching twice.
- Keep temporary import inspection screenshots and browser captures outside the repository; preserve catalog-source fixtures because regression tests compare original records and ordering.
- Class "More Documents" dropdowns list Fresh-Teacher GitHub repos from one static map and load repo files in the browser from the public GitHub tree API; this keeps the catalog static and avoids a server rate-limit bottleneck.
