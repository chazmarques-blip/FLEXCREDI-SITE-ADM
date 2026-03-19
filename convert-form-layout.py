#!/usr/bin/env python3
"""
Script to convert aplicacao.html form fields to single-column mobile-first layout
- Removes external labels
- Converts to placeholder-only format
- Changes from col-6 to full-width
"""

import re

# Read the file
with open('/home/user/webapp/aplicacao.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern 1: Remove <div class="row"> and nested col-6 structure with labels
# This handles the most common pattern in aplicacao.html

# Pattern: Find form groups with labels and convert them
pattern1 = r'<div class="row">.*?</div>\s*(?=<!--|\s*<div class="row">|<div class="step-navigation">|</div><!-- End Step)'

def convert_form_group(match):
    """Convert a form group from 2-column with labels to single-column with placeholders"""
    group_html = match.group(0)
    
    # Skip if already converted or doesn't contain col-6
    if 'col-6' not in group_html and 'col-12' not in group_html:
        return group_html
    
    # Extract all form groups within this row
    form_groups = re.findall(
        r'<div class="form-group">.*?</div>\s*</div>',
        group_html,
        re.DOTALL
    )
    
    converted_groups = []
    
    for group in form_groups:
        # Extract label text
        label_match = re.search(r'<label[^>]*>.*?<span[^>]*>(.*?)</span>.*?</label>', group, re.DOTALL)
        if not label_match:
            label_match = re.search(r'<label[^>]*>(.*?)</label>', group, re.DOTALL)
        
        label_text = label_match.group(1) if label_match else ''
        label_text = re.sub(r'<[^>]+>', '', label_text).strip()  # Remove HTML tags
        
        # Add * if the field has "required"
        if 'required' in group and '*' not in label_text:
            label_text += ' *'
        
        # Extract input/select element
        input_match = re.search(r'(<(?:input|select|textarea)[^>]*>.*?(?:</(?:select|textarea)>)?)', group, re.DOTALL)
        if not input_match:
            continue
            
        input_elem = input_match.group(1)
        
        # Update placeholder or add data-translate-placeholder
        if '<input' in input_elem or '<textarea' in input_elem:
            # Check if placeholder exists
            if 'placeholder=' in input_elem:
                # Update existing placeholder
                input_elem = re.sub(
                    r'placeholder="[^"]*"',
                    f'placeholder="{label_text}"',
                    input_elem
                )
            else:
                # Add placeholder before the closing >
                input_elem = re.sub(
                    r'(\s*(?:required\s*)?/?>)',
                    f' placeholder="{label_text}"\\1',
                    input_elem
                )
            
            # Add or update data-translate-placeholder
            if 'data-translate-placeholder=' not in input_elem:
                input_elem = re.sub(
                    r'placeholder="([^"]*)"',
                    f'data-translate-placeholder="\\1" placeholder="\\1"',
                    input_elem
                )
        elif '<select' in input_elem:
            # For select elements, update the first option
            input_elem = re.sub(
                r'<option value="">.*?</option>',
                f'<option value="" data-translate="{label_text}">{label_text}</option>',
                input_elem,
                count=1
            )
        
        # Extract error div if exists
        error_match = re.search(r'(<div class="form-error"[^>]*>.*?</div>)', group, re.DOTALL)
        error_div = error_match.group(1) if error_match else ''
        
        # Build new form group (single column, no label)
        new_group = f'''                                <div class="form-group">
                                    {input_elem}
                                    {error_div}
                                </div>
'''
        converted_groups.append(new_group)
    
    if converted_groups:
        return '\n'.join(converted_groups)
    else:
        return group_html

# Apply conversion - target rows with form groups
content = re.sub(
    r'<div class="row">(.*?)</div>',
    convert_form_group,
    content,
    flags=re.DOTALL
)

# Write back
with open('/home/user/webapp/aplicacao.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ aplicacao.html converted to single-column mobile-first layout!")
print("📱 All form fields now use placeholders instead of external labels")
