# Creating a GitHub Personal Access Token

Follow these steps to create a token that will allow you to push to your repository:

1. **Go to GitHub Settings**

   - Click your profile photo in the top right
   - Click Settings

2. **Access Developer Settings**

   - Scroll down to the bottom of the left sidebar
   - Click "Developer settings"

3. **Generate Personal Access Token**

   - Click "Personal access tokens"
   - Click "Tokens (classic)"
   - Click "Generate new token (classic)"
   - Note: You might need to confirm your password

4. **Configure Token**

   - Name: "AuthorCraft Development"
   - Expiration: Choose based on your needs (e.g., 90 days)
   - Select Scopes:
     - [x] repo (Full control of private repositories)
     - This includes:
       - repo:status
       - repo_deployment
       - public_repo
       - repo:invite
       - security_events

5. **Generate and Copy Token**

   - Click "Generate token" at the bottom
   - **IMPORTANT**: Copy the token immediately! You won't be able to see it again.

6. **Use the Token**
   When pushing to GitHub, use this token as your password:

   - Username: Your GitHub username
   - Password: The token you just created

7. **Store Token Securely**
   To avoid entering the token each time:

   ```bash
   git config --global credential.helper osxkeychain
   ```

   The first time you use the token, macOS will store it in the keychain.

8. **Test the Setup**
   ```bash
   git push -u origin added-docs
   ```
   When prompted:
   - Username: Your GitHub username
   - Password: Paste your new token

Note: Keep your token secure and never commit it to version control. If you suspect your token has been compromised, you can delete it from GitHub and create a new one.
