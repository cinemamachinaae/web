import os
import re

def strip_style_v2(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the link and style block with unified link
    # This regex is robust for the specific pattern we have
    pattern = re.compile(r'  <link rel="stylesheet" href="assets/css/style\.css\?v=[0-9.]+" />\s*(<style>.*?</style>)?', re.DOTALL)
    new_content = pattern.sub('  <link rel="stylesheet" href="assets/css/style.css?v=3.5" />', content)
    
    # Also clean up any stray orphaned </style> or heads
    new_content = new_content.replace('</style>\n</head>', '</head>')
    new_content = new_content.replace('</head>\n</head>', '</head>')
    
    # Ensure footer year is 2026
    new_content = new_content.replace('© 2025', '© 2026')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

files = ['index.html', 'about.html', 'services.html', 'why-setup-matters.html', 'contact.html']
for h in files:
    if os.path.exists(h):
        strip_style_v2(h)
        print(f"Processed {h}")
