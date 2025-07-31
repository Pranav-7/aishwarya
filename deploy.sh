#!/bin/bash

echo "🚀 Deploying Aishwarya Luxury Jewelry..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo ""
    echo "🎯 Choose your deployment option:"
    echo "1. Vercel (Recommended)"
    echo "2. Netlify"
    echo "3. Firebase Hosting"
    echo "4. GitHub Pages"
    echo ""
    read -p "Enter your choice (1-4): " choice
    
    case $choice in
        1)
            echo "🚀 Deploying to Vercel..."
            echo "Visit: https://vercel.com"
            echo "1. Sign up with GitHub"
            echo "2. Import your repository"
            echo "3. Add environment variables"
            echo "4. Deploy!"
            ;;
        2)
            echo "🚀 Deploying to Netlify..."
            echo "Visit: https://netlify.com"
            echo "1. Sign up with GitHub"
            echo "2. New site from Git"
            echo "3. Choose your repository"
            echo "4. Build command: npm run build"
            echo "5. Publish directory: build"
            ;;
        3)
            echo "🚀 Deploying to Firebase Hosting..."
            if command -v firebase &> /dev/null; then
                firebase deploy
            else
                echo "Install Firebase CLI: npm install -g firebase-tools"
                echo "Then run: firebase login && firebase init hosting && firebase deploy"
            fi
            ;;
        4)
            echo "🚀 Deploying to GitHub Pages..."
            if [ -f "package.json" ]; then
                npm run deploy
            else
                echo "Add to package.json:"
                echo '"homepage": "https://yourusername.github.io/your-repo-name"'
                echo '"scripts": { "predeploy": "npm run build", "deploy": "gh-pages -d build" }'
            fi
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
else
    echo "❌ Build failed! Please check your code."
fi

echo ""
echo "📋 Next steps:"
echo "1. Set up environment variables"
echo "2. Configure Firebase security rules"
echo "3. Test all features"
echo "4. Set up custom domain (optional)"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions!" 