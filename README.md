## Here we have a train station scheduling console. It reads from a firebase database and also, if users enter proper credentials, writes to the database.

# Firebase, jQuery, javascript, HTML, CSS, Bootstrap 4

### "Control Panel" Access
* "Control Panel" refers to data entry/edit operations. That includes addition of new train lines and modification of existing lines (modify/delete)
* By default, Control Panel operations are ready only (disabled with opacity applied)
* Users can unlock the Control Panel by entering credentials which are currently defined in a global variable (chris/chris or tommy/tommy will work)
* From that point, you'll see the "Add Line" form and edit/delete buttons become active
* **Note: right now, the delete button on the schedule actually deletes rows from firebase. However, the edit functionality is not fully implemented; it edits the HTML content, but not the firebase content

### Input validation
* All inputs are validated to some extent, and users are displayed corrective feedback when necessary

### Responsiveness
* The site is fully responsive. Text begins to shrink at 600 pixels width, and when the screen shrinks to fewer than 400 pixels in width, the edit/delete columns are removed from the table
