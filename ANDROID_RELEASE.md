# Publication Android — Prestacar Services

Ce dépôt contient une PWA multilingue. Le projet Android est préparé comme une **Trusted Web Activity (TWA)** : l'application Android ouvre la PWA officielle `https://prestacarservice.com/fr/` en plein écran, sans maintenir une seconde interface web indépendante.

## Configuration confirmée dans Google Play Console

| Élément | Valeur |
| --- | --- |
| Nom Play Store | Prestacar Services |
| Nom court sur le téléphone | Prestacar |
| Identifiant Android / package ID | `prestacarservice.com` |
| Domaine vérifié | `prestacarservice.com` |
| Page de démarrage | `/fr/` |
| Version initiale | `1.0.0 (1)` |
| API Android cible | 36 (Android 16) |

**Point essentiel :** l'identifiant Android doit correspondre exactement au nom de package enregistré dans la fiche Google Play. Pour cette fiche, l'identifiant attendu est `prestacarservice.com`. Ne pas réutiliser un ancien AAB compilé avec `com.prestacarservice.app` : Google Play le refusera car son identifiant est différent.

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
base64 < upload-key.jks | tr -d '\\n'
```

Sous Windows PowerShell, pour copier directement la chaîne Base64 dans le presse-papiers :

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("$HOME\\upload-key.jks")) | Set-Clipboard
```

Copier la sortie Base64 dans le secret GitHub ; ne pas la mettre dans un fichier du dépôt.

## 3. Générer le nouveau fichier AAB

Après la mise à jour de `android/twa-manifest.json` sur `main`, le workflow **Build Prestacar Android App Bundle** est déclenché automatiquement lorsque les secrets de signature existent.

Pour lancer manuellement une nouvelle compilation si nécessaire :

1. Ouvrir l'onglet **Actions** du dépôt GitHub.
2. Sélectionner **Build Prestacar Android App Bundle**.
3. Cliquer sur **Run workflow**.
4. Attendre que l'exécution affiche le statut **Success**.
5. Ouvrir l'exécution et télécharger l'artefact `prestacar-android-release`.

L'artefact contient :
- `app-release-bundle.aab` — le fichier à téléverser dans Google Play Console ;
- `app-release-signed.apk` — une version à installer pour les tests Android.

Le workflow régénère le projet Android avec Bubblewrap, utilise JDK 17 et Android API 36, puis lance la validation PWA intégrée et la compilation signée. Il ne téléverse pas automatiquement l'application sur Google Play.

**Avant l'importation dans Play Console :** vérifier que la nouvelle compilation est issue du commit ayant `packageId: "prestacarservice.com"`. Ne pas envoyer l'ancien fichier AAB construit avec `com.prestacarservice.app`.

## 4. Activer la vérification TWA du domaine

Une TWA a besoin de Digital Asset Links pour démontrer que l'application Android et le site appartiennent au même propriétaire. Sans vérification, le navigateur peut afficher une barre d'interface de navigateur au lieu d'ouvrir l'expérience TWA en plein écran.

Le fichier est publié à l'adresse exacte :

`https://prestacarservice.com/.well-known/assetlinks.json`

Son champ `package_name` doit rester égal à `prestacarservice.com`. La liste doit inclure l'empreinte SHA-256 du certificat de signature utilisé par l'application installée :

- conserver l'empreinte du certificat d'envoi pour les installations directes de l'APK signé avec la clé d'envoi ;
- ajouter également l'empreinte SHA-256 du **certificat App signing key certificate** indiqué dans Play Console → Intégrité de l'application, pour les installations provenant de Google Play.

L'empreinte Play App Signing est différente de l'empreinte de la clé d'envoi. Ne pas remplacer l'empreinte existante par une valeur supposée : récupérer les deux empreintes depuis les certificats réels.

Le fichier doit être servi publiquement en HTTPS, sans connexion ni redirection vers une page HTML.

## 5. Préparer la fiche Google Play

Avant l'envoi pour examen, préparer notamment :
- l'icône haute résolution, les captures d'écran de vrais écrans de l'application et l'image de présentation ;
- le titre, la description courte et la description complète ;
- une URL de politique de confidentialité publique ;
- les déclarations « Sécurité des données », classification du contenu, public cible et présence éventuelle de publicités ;
- les éventuelles instructions d'accès nécessaires aux examinateurs.

Google Play exige, pour les nouvelles applications et mises à jour soumises depuis le 31 août 2026, Android 16 / API 36 ou supérieur. Voir la [politique officielle de niveau d'API cible](https://support.google.com/googleplay/android-developer/answer/11926878).

## Attention à l'éligibilité Google Play

Une TWA est une manière officielle d'empaqueter une PWA, mais cela ne garantit pas l'acceptation de la fiche. Google Play peut refuser les applications qui ne font qu'afficher un site sans utilité mobile suffisante, ou qui ont peu de fonctionnalités et de contenu. Il faut donc vérifier que l'application apporte une expérience mobile utile, stable et suffisamment complète.

La compilation et la validation automatique ne remplacent pas les essais sur plusieurs téléphones Android ni la décision finale de Google Play.

## Liens techniques

- [Guide officiel Trusted Web Activity](https://developer.android.com/develop/ui/views/webapps/guide-trusted-web-activities-version2)
- [Documentation Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)
- [Politique Google Play — fonctionnalité et expérience utilisateur](https://support.google.com/googleplay/android-developer/answer/9898783)
