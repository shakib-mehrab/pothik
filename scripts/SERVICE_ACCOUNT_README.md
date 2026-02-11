# ⚠️ IMPORTANT: Service Account Security

## Never commit this file!

The `serviceAccountKey.json` file contains admin credentials for your Firebase project.

### If accidentally committed:

1. **Immediately revoke the key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Project Settings → Service Accounts
   - Find the compromised key and delete it

2. **Generate a new key:**
   - Click "Generate new private key"
   - Download and save as `serviceAccountKey.json`

3. **Remove from git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch scripts/serviceAccountKey.json" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

### To get your service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ Settings → **Project settings**
4. Go to **Service accounts** tab
5. Click **Generate new private key**
6. Save the file as `serviceAccountKey.json` in this folder
