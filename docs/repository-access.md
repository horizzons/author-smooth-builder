# Getting Repository Access

To get direct push access to the repository, follow these steps:

1. **GitHub Organization Membership**

   - Request to be added to the 'horizzons' GitHub organization
   - Contact the organization admin or repository owner
   - Provide them with your GitHub username

2. **Required Information to Provide**

   ```
   GitHub Username: [your username]
   Email: [your email associated with GitHub]
   Role/Purpose: [your role in the project]
   ```

3. **After Being Added to Organization**

   - You'll receive an email invitation to join the organization
   - Accept the invitation
   - Verify your membership at https://github.com/orgs/horizzons/people

4. **Repository Access**

   - Once you're a member of the organization
   - The admin needs to grant you specific access to the 'author-smooth-builder' repository
   - Access level will be set based on your role (read, write, or admin)

5. **SSH Key Setup (Recommended)**

   - If not already done, add your SSH key to your GitHub account
   - This provides secure authentication for git operations

   ```bash
   # Generate SSH key if you don't have one
   ssh-keygen -t ed25519 -C "your_email@example.com"

   # Add your SSH key to ssh-agent
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519

   # Copy your public key to clipboard (on macOS)
   pbcopy < ~/.ssh/id_ed25519.pub
   ```

   - Add the SSH key to your GitHub account:
     1. Go to GitHub Settings > SSH and GPG keys
     2. Click "New SSH key"
     3. Paste your public key

6. **Verify Access**

   ```bash
   # Test SSH connection
   ssh -T git@github.com

   # Update remote URL to use SSH (if currently using HTTPS)
   git remote set-url origin git@github.com:horizzons/author-smooth-builder.git
   ```

Contact the repository admin if you need help with any of these steps.
