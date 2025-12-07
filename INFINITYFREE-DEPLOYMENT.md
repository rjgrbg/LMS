# InfinityFree Deployment Checklist

## Before Deployment

- [ ] Update `api/db-config.php` with your InfinityFree database credentials
- [ ] Test locally to ensure everything works
- [ ] Backup your database (export scosci1_lms.sql)

## Database Setup

1. Login to InfinityFree cPanel
2. Go to MySQL Databases
3. Create a new database (note the name: epiz_xxxxx_scosci1)
4. Create a database user (note username: epiz_xxxxx)
5. Add user to database with ALL PRIVILEGES
6. Go to phpMyAdmin
7. Select your database
8. Import `scosci1_lms.sql`

## Update Configuration

Update these values in `api/db-config.php`:
```php
define('DB_HOST', 'sql123.infinityfreeapp.com'); // From InfinityFree MySQL hostname
define('DB_USER', 'epiz_xxxxx'); // Your database username
define('DB_PASS', 'your_password'); // Your database password
define('DB_NAME', 'epiz_xxxxx_scosci1'); // Your database name
```

## File Upload

### Via FTP (Recommended):
1. Download FileZilla
2. Get FTP credentials from InfinityFree account panel
3. Connect to your site
4. Upload all files to `htdocs` folder
5. Ensure folder structure is maintained

### Via File Manager:
1. Login to cPanel
2. Go to File Manager
3. Navigate to `htdocs`
4. Upload files (can zip first, then extract)

## Set Folder Permissions

Via File Manager, set permissions:
- `uploads/` → 755
- `profile_pictures/` → 755
- `submissions/` → 755

## Post-Deployment Testing

- [ ] Visit your site URL (e.g., yoursite.infinityfreeapp.com)
- [ ] Test login functionality
- [ ] Test signup functionality
- [ ] Test file upload (max 10MB on free plan)
- [ ] Test admin dashboard
- [ ] Check profile picture upload
- [ ] Verify database connections

## InfinityFree Limitations

1. **Upload Size**: 10MB per file (free plan)
2. **PHP Version**: Usually PHP 7.4 or 8.x
3. **No SSH Access**: Use FTP only
4. **Daily Hits Limit**: 50,000 hits/day
5. **Inactivity**: Account suspended after 30 days of no visits
6. **Cron Jobs**: Not available on free plan
7. **Email**: Limited email functionality

## Troubleshooting

### Database Connection Issues:
- Verify credentials in db-config.php
- Check if database user has proper privileges
- Ensure database is imported correctly

### File Upload Issues:
- Check folder permissions (755 or 777)
- Verify file size is under 10MB
- Check if folders exist: uploads/, profile_pictures/, submissions/

### 404 Errors:
- Ensure .htaccess files are uploaded
- Check if files are in htdocs folder
- Verify file names match exactly (case-sensitive)

### Blank Pages:
- Enable error reporting temporarily
- Check error logs in cPanel
- Verify PHP version compatibility

## Support

- InfinityFree Forum: https://forum.infinityfree.com/
- Documentation: https://infinityfree.com/support/

## Security Recommendations

1. Change default admin credentials after first login
2. Keep database credentials secure
3. Regularly backup your database
4. Monitor file uploads for suspicious activity
5. Consider upgrading to paid hosting for production use
