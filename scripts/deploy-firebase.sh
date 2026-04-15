#!/usr/bin/env bash
# Deploy Firestore rules + indexes to the richblok-app project.
# Requirements: `firebase-tools` installed globally (npm i -g firebase-tools)
# Run `firebase login` once on your machine, then run this script.
#
# This does NOT require Firebase Blaze plan — only firestore:rules and firestore:indexes,
# which are on the free Spark plan.

set -e

if ! command -v firebase &> /dev/null; then
  echo "Error: firebase-tools not installed."
  echo "Install with: npm install -g firebase-tools"
  exit 1
fi

echo "→ Setting active project to richblok-app..."
firebase use richblok-app

echo "→ Deploying Firestore rules + indexes..."
firebase deploy --only firestore:rules,firestore:indexes

echo "✓ Done. Your Firestore is now enforcing the rules in firestore.rules."
echo "  Verify at: https://console.firebase.google.com/project/richblok-app/firestore/rules"
