# Investy - Cryptocurrency Portfolio Dashboard

A modern cryptocurrency portfolio tracking dashboard with a clean and responsive design.

## Features

- Secure login system
- User registration with password validation
- Real-time portfolio tracking
- Interactive price charts
- Market overview with top gainers
- Responsive design for all devices
- Asset management interface

## Getting Started

1. Clone this repository
2. Open `index.html` in your web browser
3. Either create a new account or use the following demo credentials:
   - Email: demo@example.com
   - Password: demo123

## Project Structure

```
.
├── index.html           # Login page
├── signup.html         # Account creation page
├── dashboard.html       # Main dashboard
├── styles/
│   ├── common.css      # Shared styles
│   ├── login.css       # Login/Signup styles
│   └── dashboard.css   # Dashboard styles
├── js/
│   ├── login.js        # Login functionality
│   ├── signup.js       # Account creation functionality
│   └── dashboard.js    # Dashboard functionality
└── assets/             # Images and icons
```

## Dependencies

- Chart.js (loaded via CDN)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

To modify the project:

1. Edit HTML files for structure changes
2. Modify CSS files in the `styles` directory for styling
3. Update JavaScript files in the `js` directory for functionality

## Security Features

- Password strength validation
- Password confirmation matching
- Client-side form validation
- Session management with localStorage

## Notes

- This is a frontend-only demo
- In a production environment, you would need to:
  - Implement proper backend authentication
  - Use real API endpoints for market data
  - Add proper error handling
  - Implement secure session management
  - Add email verification
  - Implement proper password hashing and security measures 