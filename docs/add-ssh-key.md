# Adding Your SSH Key to GitHub

1. Copy your SSH public key:

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCpDn8P02uerAoZ0wV1OPnPSgqyK1ajOyknOlUHpLsrdksRf/qfNWeXO/UKi7C4K4MkyIIozYwcok3Nm8q4V3JbcfS7nDvYV0OV7TqHua8FLNYr1fgjfOGPMcvvhHY0+YZ5zXPXpuuQWftVXSdeMVPIucOp0xDykYF5qio2Nb/5fE2vx+blI6ffWodR3xZL2y12JpGSf0cyIGhlQkY2Sb7rXAMtOvZgdW0pvzY7Jcz2X+b3//oMQAyC4V/eQH/oagvwbXAjKZdzIw/gxJTWsg05rSmflcxUTXcnHJ4p8HFUvCEmrOtnvSXeKcyo96Tqk5X1l6wd41H8fON7s46nG11AYxretq/hoixFvO/+O5Jg8k+5cZ5ZPozaKB+MBPeVYFUH4DAADovVRHqhUEoDuvJh2BVnaxEjLf/CME+yliP1XaUFTtZk1frhnr4gLS14H92AF4s9kLEXQivH7j09Kc/D7bjovxddhDzYhGbdoJu7i5W8cZHIfqmZt6Uqr9e6COE= jorge@Jorge-MBP
```

2. Add this key to your GitHub account:

   - Go to GitHub.com and log in
   - Click your profile picture → Settings
   - Click "SSH and GPG keys" in the sidebar
   - Click "New SSH key"
   - Give it a title (e.g., "MacBook Pro")
   - Paste the key in the "Key" field
   - Click "Add SSH key"

3. After adding the key, test the connection:

```bash
ssh -T git@github.com
```

You should see a message like: "Hi username! You've successfully authenticated..."

4. Then try pushing your changes again:

```bash
git push -u origin added-docs
```

Note: Make sure you've fixed the remote URL first:

```bash
# Remove the malformed remote
git remote remove origin

# Add it back correctly
git remote add origin git@github.com:horizzons/author-smooth-builder.git
```
