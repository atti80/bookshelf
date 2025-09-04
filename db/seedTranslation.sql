INSERT INTO "languages" ("code", "name", "isActive")
VALUES 
  ('en', 'English', true),
  ('hu', 'Hungarian', true)
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "translations" ("translationKey", "languageCode", "translationText")
VALUES
  ('home_title', 'en', 'bookshelf'),
  ('home_title', 'hu', 'Könyvelvonó'),
  ('all_genres', 'en', 'All genres'),
  ('all_genres', 'hu', 'Összes kategória'),
  ('search', 'en', 'Search'),
  ('search', 'hu', 'Keresés'),
  ('register', 'en', 'Register'),
  ('register', 'hu', 'Regisztráció'),
  ('sign_in', 'en', 'Sign in'),
  ('sign_in', 'hu', 'Bejelentkezés'),
  ('sign_out', 'en', 'Sign out'),
  ('sign_out', 'hu', 'Kijelentkezés'),
  ('name', 'en', 'Name'),
  ('name', 'hu', 'Név'),
  ('password', 'en', 'Password'),
  ('password', 'hu', 'Jelszó'),
  ('back', 'en', 'Back'),
  ('back', 'hu', 'Vissza'),
  ('guest', 'en', 'Guest'),
  ('guest', 'hu', 'Vendég'),
  ('favorites', 'en', 'Favorites'),
  ('favorites', 'hu', 'Kedvencek'),
  ('last_login', 'en', 'Last login'),
  ('last_login', 'hu', 'Utolsó bejelntkezés'),
  ('read_more', 'en', 'Read more'),
  ('read_more', 'hu', 'Tovább olvasom'),
  ('like', 'en', 'Like'),
  ('like', 'hu', 'Tetszik'),
  ('unlike', 'en', 'Unlike'),
  ('unlike', 'hu', 'Visszavonás'),
  ('author', 'en', 'Author'),
  ('author', 'hu', 'Szerző'),
  ('no_comments', 'en', 'No comments'),
  ('no_comments', 'hu', 'Nincs hozzászólás'),
  ('sign_in_to_comment', 'en', 'Please sign in to comment!'),
  ('sign_in_to_comment', 'hu', 'Hozzászóláshoz jelentkezz be!'),
  ('sign_in_to_like', 'en', 'Please sign in to like!'),
  ('sign_in_to_like', 'hu', 'Bejelentkezés szükséges!')
  ('comments', 'en', 'Comments'),
  ('comments', 'hu', 'Hozzászólások'),
  ('comment', 'en', 'Comment'),
  ('comment', 'hu', 'Hozzászólás'),
  ('comment_placeholder', 'en', 'Type your comment here...'),
  ('comment_placeholder', 'hu', 'Írd ide a hozzászólásodat...'),
  ('delete', 'en', 'Delete'),
  ('delete', 'hu', 'Törlés'),
  ('delete_confirm', 'en', 'Delete this comment?'),
  ('delete_confirm', 'hu', 'Törlöd ezt a hozzászólást?'),
  ('cancel', 'en', 'Cancel'),
  ('cancel', 'hu', 'Mégsem'),
  ('submit', 'en', 'Submit'),
  ('submit', 'hu', 'Küldés'),
  ('user_not_found', 'en', 'User not found'),
  ('user_not_found', 'hu', 'Nincs ilyen felhasználó'),
  ('incorrect_password', 'en', 'Incorrect password'),
  ('incorrect_password', 'hu', 'Hibás jelszó'),
  ('name_required', 'en', 'Name is required'),
  ('name_required', 'hu', 'A név megadása kötelező'),
  ('password_required', 'en', 'Password is required'),
  ('password_required', 'hu', 'A jelszó megadása kötelező'),
  ('invalid_email', 'en', 'Invalid email address'),
  ('invalid_email', 'hu', 'Hibás email formátum'),
  ('password_short', 'en', 'Password must be at least 8 characters'),
  ('password_short', 'hu', 'A jelszó legyen legalább 8 karakter'),
  ('unable_login', 'en', 'Unable to log you in'),
  ('unable_login', 'hu', 'A bejelentkezés nem sikerült'),
  ('user_exists', 'en', 'Account already exists for this email'),
  ('user_exists', 'hu', 'Ezzel az email címmel már regisztráltak'),
  ('unable_register', 'en', 'Unable to create account'),
  ('unable_register', 'hu', 'Regisztráció nem sikerült'),
  ('categories', 'en', 'Categories'),
  ('categories', 'hu', 'Kategóriák'),
  ('no_articles', 'en', 'No articles found'),
  ('no_articles', 'hu', 'Nincs találat'),
  ('old_password', 'en', 'Current password'),
  ('old_password', 'hu', 'Régi jelszó'),
  ('new_password', 'en', 'New password'),
  ('new_password', 'hu', 'Új jelszó'),
  ('confirm_password', 'en', 'Confirm new password'),
  ('confirm_password', 'hu', 'Új jelszó megerősítése'),
  ('change_password', 'en', 'Update password'),
  ('change_password', 'hu', 'Jelszó módosítás'),
  ('new_password_same', 'en', 'New password is same as old'),
  ('new_password_same', 'hu', 'Az új jelszó megegyezik a régivel'),
  ('unable_update_pswd', 'en', 'Unable to update password'),
  ('unable_update_pswd', 'hu', 'A jelszó módosítása nem sikerült'),
  ('old_password_required', 'en', 'Current password is required'),
  ('old_password_required', 'hu', 'A régi jelszó megadása kötelező'),
  ('passwords_dont_match', 'en', 'Passwords don''t match'),
  ('passwords_dont_match', 'hu', 'A jelszó megerősítése hibás'),
  ('old_password_incorrect', 'en', 'Current password is incorrect'),
  ('old_password_incorrect', 'hu', 'A régi jelszó hibás'),
  ('update', 'en', 'Update'),
  ('update', 'hu', 'Módosít'),
  ('forgotten_password', 'en', 'Forgotten password'),
  ('forgotten_password', 'hu', 'Elfelejtett jelszó'),
  ('reset_password', 'en', 'Reset password'),
  ('reset_password', 'hu', 'Jelszó visszaállítás'),
  ('unable_request_reset', 'en', 'Unable to request password reset'),
  ('unable_request_reset', 'hu', 'A jelszó visszaállítás kérése nem sikerült'),
  ('email_not_registered', 'en', 'There is no account registered with that email address'),
  ('email_not_registered', 'hu', 'Nincs regisztrált felhasználó ezzel az email címmel'),
  ('reset_email_sent', 'en', 'We''ve sent a password reset link to this email address.'),
  ('reset_email_sent', 'hu', 'Küldtünk egy jelszó visszaállító linket erre az e-mail címre.'),
  ('reset_link_invalid', 'en', 'This password reset link is invalid or has expired. Please request a new link.'),
  ('reset_link_invalid', 'hu', 'Ez a jelszó visszaállító link érvénytelen vagy lejárt. Kérj egy újat.'),
  ('password_reset', 'en', 'Your password has been reset. You can now sign in with your new password.'),
  ('password_reset', 'hu', 'A jelszavad vissza lett állítva. Most már bejelentkezhetsz az új jelszavaddal.'),
  ('password_reset_emailsubject', 'en', 'Reset Your Password for Konyvelvono.hu'),
  ('password_reset_emailsubject', 'hu', 'Könyvelvonó jelszó visszaállítás'),
  ('password_reset_emailbody', 'en', 'Hello,

We received a request to reset the password for your Konyvelvono account.
To reset your password, please click the link below.

<reset_password_link>

This link is valid for 60 minutes.

If you did not request a password reset, you can safely ignore this email. Your password will not be changed.

Best,
The Konyvelvono Team')
  ('password_reset_emailbody', 'hu', 'Üdvözlöm!

Kérést kaptunk a Könyvelvonó fiókjához tartozó jelszó visszaállítására.
A jelszó visszaállításához kattintson az alábbi linkre.

<reset_password_link>

Ez a link 60 percig érvényes.

Ha nem kért jelszó visszaállítást, nyugodtan figyelmen kívül hagyhatja ezt az e-mailt. A jelszava nem kerül megváltoztatásra.

Üdvözlettel,
Könyvelvonó')
ON CONFLICT ("translationKey", "languageCode") DO NOTHING;
