# 🏁 Weekly Kart Check System

A comprehensive web-based system for tracking kart maintenance and inspections. This system allows you to easily check each of the 36 karts, log any issues found, and maintain a searchable database of all maintenance records.

## Features

### 🌍 Multi-Language Support
- **English/Dutch Language Toggle**: Switch between languages with a single click
- All interface elements, instructions, and messages are fully translated
- Date formatting adapts to the selected language

### ✅ Kart Selection
- Visual grid showing all 36 karts (numbered 1-36)
- **Streamlined Workflow**: Only select karts that have issues
- Color-coded status indicators:
  - 🔵 Blue: Not checked yet
  - 🔴 Red: Selected as having issues
  - 🟠 Orange: Previously checked with issues
  - 🟢 Green: Previously checked and OK

### 📋 Weekly Check Checklist (15 Focused Items)
Streamlined inspection checklist covering essential kart components:
1. Buttons
2. Silent block holders
3. The chassis / peripheral protection (welding and/or breakage)
4. The headlights/localization emittors
5. Nose and front fasteners
6. Steering
7. Brakes (level + good working order + brake lights)
8. The clearance of the bearings, spindle, fuse left right
9. Bumpers
10. Tires
11. Silent blocks
12. Safety Belt
13. Tablet Holder
14. General visual condition
15. Clean

### 📊 Dashboard & Monitoring
- Real-time view of all maintenance records
- Search and filter functionality
- Export data to CSV
- Timestamp tracking for each inspection
- Clear status indicators for each kart

### 💾 Data Management
- Local storage backup
- Google Sheets integration (optional)
- Automatic data persistence
- Export capabilities

## Getting Started

### Quick Start
1. **Option A - Direct Browser**: Open `index.html` in a web browser
2. **Option B - Local Server** (Recommended): Run `start.bat` or `python server.py` for proper CORS handling
3. Select karts with issues by clicking on kart numbers (1-36)
4. Define specific problems for each selected kart
5. Add any general failures if needed
6. Click "Submit All Checklists" to save the data
7. Use "View Dashboard" to see all records

### Google Sheets Integration (Optional)
For automatic data logging to a spreadsheet, follow the setup instructions in `GOOGLE_SHEETS_SETUP.md`.

**🆕 NEW**: The system now creates 4 comprehensive sheets:
- **Submissions_OLD**: Your existing data (preserved)
- **Kart_Overview**: Complete tracking of all 36 karts
- **Error_Log**: Detailed problem tracking
- **Submissions_Summary**: Weekly check summaries

Use `test-new-system.html` to test the new Google Sheets integration.

## How to Use

### 1. Select Karts with Issues
- Click on kart numbers that have problems (they'll turn red)
- Only select karts that need attention - don't select perfect karts
- Selected karts will appear in the "Karts with Issues" section
- Use the language toggle (🇳🇱 NL / 🇬🇧 EN) to switch languages

### 2. Define Problems for Each Kart
- Click on a selected kart to open its individual problem checklist
- Mark the specific problems found with that particular kart (15 focused items)
- Add any additional problems in the kart-specific text area
- Click "Save Kart Problems" to save the problems for that kart
- Repeat for each kart that has issues

### 3. Submit All at Once
- Once all problematic karts have their specific problems defined
- Add any general failures in the "General Other Failures / Repairs" section
- Click "Submit All Checklists" to save everything
- Perfect karts (not selected) are automatically marked as OK
- Enjoy the success animation showing your weekly progress!

### 4. Viewing Records
- Click "View Dashboard" to see all maintenance records
- Use the search box to find specific dates, karts, or issues
- Filter by date to see specific weekly checks
- Export data to CSV for external analysis

## File Structure

```
WeeklyKartCheck/
├── index.html                    # Main application file
├── styles.css                    # Styling and layout
├── script.js                     # Application logic
├── server.py                     # Python HTTP server for local development
├── start.bat                     # Windows batch file to start the server
├── test-connection.html          # Test page for Google Sheets connection
├── test-new-system.html         # Test page for new Google Sheets system
├── GOOGLE_SHEETS_SETUP.md        # Google Sheets integration guide (main)
├── google-sheets-setup.md        # Alternative Google Sheets setup guide
├── google-sheets-setup-simple.md # Simplified Google Sheets setup
├── google-apps-script-debug.gs   # Debug version of Google Apps Script
├── image.png                     # Project image
├── Naamloze spreadsheet - Blad1.pdf # Sample spreadsheet
└── README.md                     # This file
```

## Technical Details

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design works on desktop and mobile
- Optimized for tablets and larger screens

### Data Storage
- Uses browser localStorage for data persistence
- Data survives browser restarts
- Can be exported to CSV format
- Optional Google Sheets integration for cloud storage
- Automatic data backup on form submission

### Development Server
- Python HTTP server with CORS support
- Automatic browser opening
- Proper file serving for local development
- Cross-platform compatibility (Windows batch file included)

### Security
- All data is stored locally by default
- No external dependencies required for basic functionality
- Google Sheets integration requires proper API setup
- CORS headers properly configured for local development

## Customization

### Adding New Checklist Items
Edit the HTML in `index.html` to add new checklist items in the detailed checklist section:

```html
<label><input type="checkbox" name="checklist" value="new_item"> 
    <span data-en="16. New Item" data-nl="16. Nieuw Item">16. New Item</span>
</label>
```

**Important**: Don't forget to add translations for both English and Dutch!

### Modifying Kart Count
To change the number of karts, update the loop in `script.js`:

```javascript
for (let i = 1; i <= 50; i++) { // Change 36 to desired number
    // ... kart button creation code
}
```

### Adding New Languages
To add support for additional languages:

1. Add language data attributes to HTML elements: `data-en="English text" data-nl="Dutch text" data-fr="French text"`
2. Update the `updateLanguage()` function in `script.js`
3. Add a new language toggle button in the header

### Styling Changes
Modify `styles.css` to change colors, fonts, or layout. The CSS uses CSS Grid and Flexbox for responsive design with modern gradients and animations.

## Troubleshooting

### Data Not Saving
- Check if JavaScript is enabled
- Ensure browser supports localStorage
- Try clearing browser cache and reloading
- Use the local server (`start.bat` or `python server.py`) instead of opening HTML directly

### Google Sheets Not Working
- Verify API credentials are correct
- Check browser console for error messages
- Ensure the spreadsheet is shared with the service account
- Use the test connection page (`test-connection.html`) to verify setup
- Follow the detailed setup guide in `GOOGLE_SHEETS_SETUP.md`

### Language Issues
- If translations don't appear, check that all HTML elements have proper `data-en` and `data-nl` attributes
- Clear browser cache if language switching doesn't work
- Ensure JavaScript is enabled for the language toggle functionality

### Mobile Issues
- The interface is responsive but works best on tablets or larger screens
- Consider using landscape orientation on phones
- Use the local server for better mobile compatibility

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the same directory
3. Use the local server (`start.bat` or `python server.py`) for proper functionality
4. Check the Google Sheets setup guides if integration isn't working
5. Ensure JavaScript is enabled in your browser

## License

This project is open source and available under the MIT License.
