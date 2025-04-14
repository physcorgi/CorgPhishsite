CorgPhish Download Files
======================

This directory contains downloadable files for the CorgPhish application.

The following files should be placed in this directory:

1. Windows installer: corgphish-win-1.2.0.exe
2. macOS package: corgphish-mac-1.2.0.dmg
3. Linux packages: 
   - corgphish-linux-1.2.0.deb (Debian/Ubuntu)
   - corgphish-linux-1.2.0.rpm (Fedora/RHEL)
4. Browser extensions: corgphish-extension-1.2.0.zip

For development and testing purposes, you may want to create placeholder files that simulate the real installation packages. These should be replaced with actual installation packages when deploying to production.

To create placeholder files for testing the download functionality, you can use:

```
# For Linux/macOS
touch corgphish-win-1.2.0.exe
touch corgphish-mac-1.2.0.dmg
touch corgphish-linux-1.2.0.deb
touch corgphish-linux-1.2.0.rpm
touch corgphish-extension-1.2.0.zip

# For Windows
echo > corgphish-win-1.2.0.exe
echo > corgphish-mac-1.2.0.dmg
echo > corgphish-linux-1.2.0.deb
echo > corgphish-linux-1.2.0.rpm
echo > corgphish-extension-1.2.0.zip
```

NOTE: When implementing the actual download system, ensure that:
1. File integrity verification is implemented (checksums)
2. Files are served securely (HTTPS)
3. Download stats are tracked for analytics
4. Version control and update notifications are properly managed 