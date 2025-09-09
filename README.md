# 🏁 Weekly Kart Check System

A comprehensive web-based system for tracking kart maintenance and inspections. This system allows you to easily check each of the 36 karts, log any issues found, and maintain a searchable database of all maintenance records.

## Features

### ✅ Kart Selection
- Visual grid showing all 36 karts (numbered 1-36)
- **New Workflow**: Only select karts that have issues
- Color-coded status indicators:
  - 🔵 Blue: Not checked yet
  - 🔴 Red: Selected as having issues (with pulsing animation)
  - 🟠 Orange: Previously checked with issues
  - 🟢 Green: Previously checked and OK

### 📋 Weekly Check Checklist (23 Items)
Complete inspection checklist covering all kart components:
1. The front silent blocks, fuse supports, "T" supports
2. The front of the chassis / peripheral protection (welding and/or breakage)
3. The headlights/localization emittors
4. Nose and front fasteners
5. The front peripheral protection, front bumper
6. Brakes (level + good working order + brake lights)
7. The clearance of the bearings of left front wheel, left spindle, steering
8. The left side bumper
9. The state and the pressure of the left front tire
10. The left side silent blocks
11. The safety belt (both sides)
12. The state and pressure of the left rear tire
13. The left rear bumper
14. The rear silent blocks + support
15. Right rear bumper
16. The state and pressure of the right rear tire
17. The right side silent blocks
18. The play of the right front wheel bearings, right spindle
19. The state and the pressure of the right front tire
20. Tablet holder
21. Right front bumper
22. General visual condition
23. Blow off the floor and wipe down the fairings

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
1. Open `index.html` in a web browser
2. Click on any kart number (1-36) to start inspection
3. Either check "Everything is OK" or fill out the detailed checklist
4. Click "Submit Checklist" to save the data
5. Use "View Dashboard" to see all records

### Google Sheets Integration (Optional)
For automatic data logging to a spreadsheet, follow the setup instructions in `google-sheets-setup.md`.

## How to Use

### 1. Select Karts with Issues
- Click on kart numbers that have problems (they'll turn red and pulse)
- Only select karts that need attention - don't select perfect karts
- Selected karts will appear in the "Karts with Issues" section

### 2. Define Problems for Each Kart
- Click on a selected kart to open its individual problem checklist
- Mark the specific problems found with that particular kart
- Add any additional problems in the kart-specific text area
- Click "Save Kart Problems" to save the problems for that kart
- Repeat for each kart that has issues

### 3. Submit All at Once
- Once all problematic karts have their specific problems defined
- Add any general failures in the "General Other Failures / Repairs" section
- Click "Submit All Checklists" to save everything
- Perfect karts (not selected) are automatically marked as OK

### 4. Viewing Records
- Click "View Dashboard" to see all maintenance records
- Use the search box to find specific dates, karts, or issues
- Filter by date to see specific weekly checks
- Export data to CSV for external analysis

## File Structure

```
WeeklyKartCheck/
├── index.html              # Main application file
├── styles.css              # Styling and layout
├── script.js               # Application logic
├── google-sheets-setup.md  # Google Sheets integration guide
└── README.md              # This file
```

## Technical Details

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design works on desktop and mobile

### Data Storage
- Uses browser localStorage for data persistence
- Data survives browser restarts
- Can be exported to CSV format
- Optional Google Sheets integration for cloud storage

### Security
- All data is stored locally by default
- No external dependencies required for basic functionality
- Google Sheets integration requires proper API setup

## Customization

### Adding New Checklist Items
Edit the HTML in `index.html` to add new checklist categories or items:

```html
<div class="checklist-category">
    <h4>🆕 New Category</h4>
    <div class="checklist-items">
        <label><input type="checkbox" name="newcategory" value="new_item"> New Item</label>
    </div>
</div>
```

### Modifying Kart Count
To change the number of karts, update the loop in `script.js`:

```javascript
for (let i = 1; i <= 50; i++) { // Change 36 to desired number
    // ... kart button creation code
}
```

### Styling Changes
Modify `styles.css` to change colors, fonts, or layout. The CSS uses CSS Grid and Flexbox for responsive design.

## Troubleshooting

### Data Not Saving
- Check if JavaScript is enabled
- Ensure browser supports localStorage
- Try clearing browser cache and reloading

### Google Sheets Not Working
- Verify API credentials are correct
- Check browser console for error messages
- Ensure the spreadsheet is shared with the service account

### Mobile Issues
- The interface is responsive but works best on tablets or larger screens
- Consider using landscape orientation on phones

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all files are in the same directory
3. Ensure you're opening the HTML file through a web server (not file://)

## License

This project is open source and available under the MIT License.
