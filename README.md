# Create a standard README file
echo "# SentinelCore SecureOps - Enterprise Security Operations" > README.md

# Stage and commit
git add README.md
git commit -m "Initial commit: Repository base setup"

# Link to your GitHub public repo (replace with your actual URL)
git branch -M main
git remote add origin https://github.com/pallaviemankar2007-a11y/sentinelcore-secureops.git
git push -u origin main
