<?php
// Upload configuration for InfinityFree
// InfinityFree default limits: 10MB per file
// These settings may not work on all free hosts due to restrictions

@ini_set('upload_max_filesize', '10M');
@ini_set('post_max_size', '10M');
@ini_set('max_execution_time', '60');
@ini_set('max_input_time', '60');
@ini_set('memory_limit', '128M');

// Define upload limits
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB in bytes
define('ALLOWED_EXTENSIONS', ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip']);
?>
