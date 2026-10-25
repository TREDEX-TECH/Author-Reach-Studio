-- =============================================================================
-- SYNTHETIC DEVELOPMENT DATA — NEVER RUN AGAINST PRODUCTION.
-- Run automatically by `supabase db reset` in local/dev only.
-- All names, books, invoices and payments below are fictional.
-- =============================================================================
insert into public.organizations (id, name, kind, legal_name, registration_number, is_payment_recipient)
values
  ('11111111-1111-4111-8111-111111111111','Tredex','parent_company','Tredex (placeholder legal name)','RC-PLACEHOLDER',false),
  ('22222222-2222-4222-8222-222222222222','Author Reach Studio','brand',null,null,false)
on conflict (id) do nothing;

-- Services (replace with the real catalogue from docs/07-content-inventory.md)
insert into public.services (slug, name, category, short_promise, description, scope_of_work, deliverables, eligibility, estimated_duration_days, pricing_mode, price_amount, currency, visibility, sort_order) values
  ('book-discoverability','Book Discoverability & Metadata','Optimization','Make your book findable by the right readers.','A structured review and improvement of metadata, categories and keywords.','Metadata audit; category/keyword research; listing recommendations; one revision round.',array['Metadata audit report','Recommended categories & keywords','Implementation checklist'],'A published or soon-to-be-published book',14,'from_price',250,'USD','published',1),
  ('author-profile-optimization','Author Profile Optimization','Optimization','A credible author presence that converts browsers into followers.','Optimisation of your author bio, profile imagery and retailer author pages.','Profile audit; bio rewrite; image direction; retailer page updates.',array['New author bio','Profile image brief','Before/after report'],'An existing author page or a new pen name',10,'custom_proposal',null,'USD','published',2),
  ('storefront-improvement','Book Product Page Improvement','Optimization','Stronger product pages across retailers.','Rewrite and restructure book descriptions, bullet points and editorial content.','Page audit; copy rewrite; formatting; one revision.',array['Rewritten description','Retail-ready bullet copy','Page checklist'],'Retailer product page under your control',12,'from_price',200,'USD','published',3),
  ('amazon-a-plus','Amazon A+ Content Support','Optimization','Richer Amazon detail pages where eligible.','Design and copy support for A+ Content modules.','Eligibility check; module planning; copy; design handoff.',array['A+ module plan','Copy deck','Design files'],'Amazon Brand Registry eligibility required',21,'custom_proposal',null,'USD','published',4),
  ('promotional-creative','Promotional Graphics & Video','Creative','Scroll-stopping assets for your book.','Campaign graphics, short-form video and ad creative.','Creative brief; concepts; final assets; two revisions.',array['Social graphics pack','One short-form video','Source files'],'Final cover art and brand assets supplied',21,'from_price',350,'USD','published',5),
  ('book-launch','Book Launch & Publicity Campaign','Campaigns','A coordinated launch, not a single post.','Planning and execution support for a launch window.','Launch plan; timeline; asset schedule; outreach list; weekly check-ins.',array['Launch plan','Content calendar','Outreach tracker','Post-launch report'],'Launch date at least 6 weeks away',42,'custom_proposal',null,'USD','published',6),
  ('reader-engagement','Reader Engagement Campaigns','Campaigns','Ethical reader outreach where platforms allow it.','Goodreads and reader-community engagement within platform rules.','Platform rule check; outreach plan; approved activity log; report.',array['Compliance check','Activity log','Engagement report'],'Platform rules permit the activity',28,'custom_proposal',null,'USD','published',7),
  ('author-website','Author Website & Brand Development','Web','A home base you own.','A fast, accessible author website with clear conversion paths.','Discovery; design; build; content migration; handover.',array['Responsive website','Basic SEO setup','Handover guide'],'Domain and hosting under your control',35,'custom_proposal',null,'USD','published',8)
on conflict (slug) do nothing;

insert into public.crm_pipeline_stages (slug, label, sort_order) values
  ('awaiting_brief','Awaiting brief',10)
on conflict (slug) do nothing;
