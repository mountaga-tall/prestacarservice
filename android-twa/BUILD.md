# Build Android dans le cloud

1. Ouvrir l'onglet **Actions** du dépôt GitHub.
2. Sélectionner **Build Prestacar Android (TWA)**.
3. Cliquer sur **Run workflow** et choisir la branche `feature/prestacar-android-twa`.
4. Télécharger l'artefact `prestacar-android-aab-...` du run terminé.

Tant que les secrets de signature ne sont pas configurés, l'artefact est un AAB non signé destiné à vérifier la compilation. Il ne peut pas être envoyé tel quel sur Google Play.

Ne jamais placer un fichier de clé, un mot de passe ou une clé privée dans le dépôt public.
