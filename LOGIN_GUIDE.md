# 🔐 Temporary Login System

## Demo Credentials

Use these credentials to login and access the dashboard:

### Option 1: Demo User
- **Email:** `demo@example.com`
- **Password:** `demo123`

### Option 2: John Doe
- **Email:** `john@example.com`  
- **Password:** `john123`

### Option 3: Admin
- **Email:** `admin@ciphervault.com`
- **Password:** `admin123`

## How to Login

1. Navigate to http://localhost:5175/login
2. Enter one of the demo credentials above
3. Click "Log In"
4. You'll be redirected to the dashboard automatically

## Features

✅ **Session Persistence** - Your login is saved in localStorage  
✅ **Protected Routes** - Dashboard requires authentication  
✅ **Auto-Redirect** - Redirects to login if not authenticated  
✅ **Logout Function** - Click logout button in sidebar  

## Sign Up

You can also create a new account:
1. Go to http://localhost:5175/signup
2. Enter any email and password
3. Accept terms
4. You'll be auto-logged in and redirected to dashboard

**Note:** This is a temporary authentication system for development. In production, connect to your backend API or database.
