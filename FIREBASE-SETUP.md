# Firebase setup (ekbar korlei hobe)

Admin panel er link: `https://ratulkrishna2004-cpu.github.io/portfolio/admin/`
Site e kono admin button nai; link er sheshe `/admin/` likhlei login ashbe.

## 1. Project banao
1. https://console.firebase.google.com e jao (ratulkrishna2004@gmail.com diye login).
2. **Add project** → name dao (jemon `ratul-portfolio`) → Google Analytics off rakhlei hobe → Create.

## 2. Web app add koro
1. Project er home e **</>** (Web) icon e click koro → nickname dao → **Register app**.
2. Ekta `firebaseConfig = { apiKey: "...", ... }` code dekhabe.
3. Repo te `js/firebase-config.js` file ta khule (pencil icon) `PASTE_HERE` er jaigai oi value gula boshao → Commit.

Ei value gula secret na, public repo te thakle shomossha nai.

## 3. Admin account banao (password ekhanei thake)
1. Bam pashe **Build → Authentication → Get started**.
2. **Sign-in method** tab → **Email/Password** → Enable → Save.
3. **Users** tab → **Add user** → Email: `ratulkrishna2004@gmail.com`, Password: tomar password → Add user.
4. **Settings → Authorized domains** e `ratulkrishna2004-cpu.github.io` add koro.

## 4. Database banao
1. **Build → Firestore Database → Create database** → location jekono (asia-south1 bhalo) → **Production mode** → Create.
2. **Rules** tab e giye shob muche eta paste koro → **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/{doc} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'ratulkrishna2004@gmail.com';
    }
  }
}
```

Er mane: shobai site porte parbe, kintu shudhu tomar account e login thaklei change kora jabe.

## 5. Use koro
- `/admin/` e giye email + password diye login.
- Ja ichha edit / add / delete kore **Save changes**. Site refresh korle notun lekha dekhabe.
- **Forgot password?** e click korle tomar mail e ekta reset link jabe.
- Panel er niche **Change password** theke jekono shomoy password bodlano jay.
