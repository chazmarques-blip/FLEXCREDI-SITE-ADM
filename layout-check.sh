#!/bin/bash
# FLEXCREDI Layout Consistency Check

echo "=== FLEXCREDI Layout Check ==="
echo ""
echo "1. Hero Padding (should be 110px top)"
grep -n "\.hero {" css/layout-adjustments.css css/compact-layout.css

echo ""
echo "2. Navbar Height (Desktop: 105px, Tablet: 90px, Mobile: 60px)"
grep -A 2 "\.navbar {" css/style.css | head -10

echo ""
echo "3. Section Padding"
grep "\.section {" css/compact-layout.css css/layout-adjustments.css

echo ""
echo "4. Card Padding"
grep "\.card {" css/compact-layout.css | head -5

echo ""
echo "=== Layout Status ==="
echo "✓ All checks completed"
