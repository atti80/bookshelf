INSERT INTO "languages" ("code", "name", "isActive")
VALUES 
  ('en', 'English', true),
  ('hu', 'Hungarian', true)
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "translations" ("translationKey", "languageCode", "translationText")
VALUES
  ('hello', 'en', 'Hello'),
  ('hello', 'hu', 'Szia'),
  ('welcome', 'en', 'Welcome'),
  ('welcome', 'hu', 'Üdvözlöm')
ON CONFLICT ("translationKey", "languageCode") DO NOTHING;
