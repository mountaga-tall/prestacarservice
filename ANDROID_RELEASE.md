# Publication Android — Prestacar Services

Ce dépôt contient déjà une PWA multilingue. Le projet Android est préparé comme une **Trusted Web Activity (TWA)** : l'application Android ouvre la PWA officielle `https://prestacarservice.com/fr/` en plein écran, sans maintenir une seconde interface web indépendante.

## Configuration proposée

| Élément | Valeur |
| --- | --- |
| Nom Play Store | Prestacar Services |
| Nom court sur le téléphone | Prestacar |
| Identifiant Android proposé | `com.prestacarservice.app` |
| Domaine vérifié | `prestacarservice.com` |
| Page de démarrage | `/fr/` |
| Version initiale | `1.0.0 (1)` |
| API Android cible | 36 (Android 16) |

**Important :** valider l'identifiant Android avant de créer la fiche Google Play. L'identifiant d'une application publiée ne peut pas être remplacé pour les mises à jour ultérieures. Le nom et l'identifiant de ce fichier sont des propositions initiales.

## 1. Créer la clé de signature privée

La clé d'envoi (« upload key ») doit être créée et conservée par le propriétaire du compte Play Console. Elle ne doit jamais être commitée dans Git, envoyée dans une conversation ou partagée publiquement.

Depuis le dossier `android/`, sur un poste disposant du JDK 17 :

```bash
keytool -genkeypair -v \
  -keystore upload-key.jks \
  -alias prestacar-upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Conserver le fichier `upload-key.jks`, le mot de passe du keystore et le mot de passe de la clé dans un gestionnaire de mots de passe et dans une sauvegarde sécurisée.

## 2. Ajouter les secrets GitHub

Dans le dépôt GitHub : **Settings → Secrets and variables → Actions → New repository secret**.

Créer ces quatre secrets :

| Nom du secret | Valeur |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Contenu Base64 du fichier `upload-key.jks` |
| `ANDROID_KEY_ALIAS` | `prestacar-upload` |
| `ANDROID_KEYSTORE_PASSWORD` | Mot de passe du keystore |
| `ANDROID_KEY_PASSWORD` | Mot de passe de la clé |

Pour encoder la clé sous Linux :

```bash
base64 -w 0 upload-key.jks
```

Sous macOS :

```bash
base64 < upload-key.jks | tr -d '\n'
```

Sous Windows PowerShell, pour copier directement la chaîne Base64 dans le presse-papiers :

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\upload-key.jks")) | Set-Clipboard
```

Copier la sortie Base64 dans le secret GitHub ; ne pas la mettre dans un fichier du dépôt.

## 3. Générer le fichier AAB

Une fois cette branche intégrée à `main` et les quatre secrets configurés :

1. Ouvrir l'onglet **Actions** du dépôt GitHub.
2. Sélectionner **Build Prestacar Android App Bundle**.
3. Cliquer sur **Run workflow**.
4. Après la réussite, ouvrir l'exécution et récupérer l'artefact `prestacar-android-release`.

L'artefact contient :
- `app-release-bundle.aab` — le fichier à téléverser dans Google Play Console ;
- `app-release-signed.apk` — une version à installer pour les tests Android.

Le workflow régénère le projet Android avec Bubblewrap, utilise JDK 17 et Android API 36, puis lance la validation PWA intégrée et la compilation signée. Il ne téléverse pas automatiquement l'application sur Google Play.

## 4. Activer la vérification TWA du domaine

Une TWA a besoin de Digital Asset Links pour démontrer que l'application Android et le site appartiennent au même propriétaire. Sans vérification, le navigateur peut afficher une barre d'interface de navigateur au lieu d'ouvrir l'expérience TWA en plein écran.

Après avoir créé l'application dans Play Console et activé **Play App Signing** :

1. Ouvrir **App integrity / Intégrité de l'application** dans Play Console.
2. Copier l'empreinte SHA-256 du **certificat de signature de l'application** (App signing key certificate). Cette empreinte est différente de celle de la clé d'envoi.
3. Publier le fichier suivant à l'adresse exacte `https://prestacarservice.com/.well-known/assetlinks.json`, en remplaçant le marqueur par l'empreinte fournie par Play Console :

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.prestacarservice.app",
      "sha256_cert_fingerprints": [
        "REMPLACER_PAR_LE_SHA256_DU_CERTIFICAT_PLAY_APP_SIGNING"
      ]
    }
  }
]
```

Le fichier doit être servi publiquement en HTTPS, sans connexion ni redirection vers une page HTML. Pour les installations locales signées avec la clé d'envoi, on peut ajouter une deuxième empreinte SHA-256 à la même liste.

## 5. Préparer la fiche Google Play

Avant l'envoi pour examen, préparer notamment :
- l'icône haute résolution, les captures d'écran de vrais écrans de l'application et l'image de présentation ;
- le titre, la description courte et la description complète ;
- une URL de politique de confidentialité publique ;
- les déclarations « Sécurité des données », classification du contenu, public cible et présence éventuelle de publicités ;
- les éventuelles instructions d'accès nécessaires aux examinateurs.

Google Play exige actuellement, pour les nouvelles applications et les mises à jour soumises depuis le 31 août 2026, Android 16 / API 36 ou supérieur. Voir la [politique officielle de niveau d'API cible](https://support.google.com/googleplay/android-developer/answer/11926878).

## Attention à l'éligibilité Google Play

Une TWA est une manière officielle d'empaqueter une PWA, mais cela ne garantit pas l'acceptation de la fiche. Google Play refuse les applications qui ne font qu'afficher un site sans utilité mobile suffisante, ou qui ont peu de fonctionnalités et de contenu. Le dépôt actuel ressemble principalement à un site vitrine et à un catalogue de services ; il faut donc évaluer ce risque avant de payer ou de soumettre la fiche. Des parcours réellement utiles depuis le mobile (par exemple demander et suivre un devis, prendre rendez-vous ou gérer une demande client, s'ils correspondent aux services réellement proposés) renforceraient le dossier.

La compilation et la validation automatique ne remplacent pas les essais sur plusieurs téléphones Android ni la décision finale de Google Play.

## Liens techniques

- [Guide officiel Trusted Web Activity](https://developer.android.com/develop/ui/views/webapps/guide-trusted-web-activities-version2)
- [Documentation Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
- [Politique Google Play — fonctionnalité et expérience utilisateur](https://support.google.com/googleplay/android-developer/answer/9898783)
