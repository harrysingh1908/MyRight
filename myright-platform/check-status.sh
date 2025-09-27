#!/bin/bash

# MyRight Platform Status Checker
echo "🔍 Checking MyRight Platform Status..."
echo "======================================"

URL="https://myright-platform-fuk9y845h-harmanpreetss619-8030s-projects.vercel.app"

echo "🌐 Production URL: $URL"
echo ""

echo "📊 Checking deployment status..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")

if [ "$STATUS" -eq 200 ]; then
    echo "✅ Website is UP and running (HTTP $STATUS)"
elif [ "$STATUS" -eq 000 ]; then
    echo "❌ Cannot connect to website (Network issue)"
else
    echo "⚠️  Website returned HTTP $STATUS"
fi

echo ""
echo "🧪 Checking API health..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL/api/health")

if [ "$API_STATUS" -eq 200 ]; then
    echo "✅ API is healthy (HTTP $API_STATUS)"
else
    echo "⚠️  API returned HTTP $API_STATUS"
fi

echo ""
echo "🎯 Test your platform:"
echo "   → Main site: $URL"
echo "   → Search: Try searching for 'salary not paid'"
echo "   → Categories: Browse employment, housing, consumer rights"
echo ""
echo "📈 View deployment details:"
echo "   → Dashboard: https://vercel.com/harmanpreetss619-8030s-projects/myright-platform/"