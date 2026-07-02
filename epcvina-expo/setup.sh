#!/bin/bash

echo "🚀 Setting up APPE JV Expo..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
else
    echo "✅ Dependencies already installed"
fi

# Check if babel-preset-expo is installed
if ! npm list babel-preset-expo > /dev/null 2>&1; then
    echo "📦 Installing babel-preset-expo..."
    npm install babel-preset-expo --save-dev --legacy-peer-deps
else
    echo "✅ babel-preset-expo already installed"
fi

# Check if babel plugins are installed
if ! npm list @babel/plugin-transform-nullish-coalescing-operator > /dev/null 2>&1; then
    echo "📦 Installing babel plugins..."
    npm install @babel/plugin-transform-nullish-coalescing-operator @babel/plugin-transform-optional-chaining --save-dev --legacy-peer-deps
else
    echo "✅ Babel plugins already installed"
fi

# Check if react-native-worklets-core is installed
if ! npm list react-native-worklets-core > /dev/null 2>&1; then
    echo "📦 Installing react-native-worklets-core..."
    npm install react-native-worklets-core --legacy-peer-deps
else
    echo "✅ react-native-worklets-core already installed"
fi

# Update package versions
echo "📦 Updating package versions..."
npx expo install react-native-gesture-handler@~2.28.0 react-native-reanimated@~4.1.1 react-native-screens@~4.16.0 -- --legacy-peer-deps

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your Supabase credentials"
else
    echo "✅ .env file exists"
fi

# Check if assets exist
if [ ! -f "assets/icon.png" ]; then
    echo "⚠️  Warning: assets/icon.png not found"
    echo "   Please add your app icon to assets/"
else
    echo "✅ Assets found"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Supabase credentials"
echo "2. Make sure appejv-api is running on port 8081"
echo "3. Run: npm start"
echo ""
