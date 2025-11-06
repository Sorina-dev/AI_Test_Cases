# Azure DevOps Bug Extractor

This tool connects to Azure DevOps and extracts all bugs matching your criteria into a CSV file.

## 📋 Setup Instructions

### 1. Get Your Personal Access Token (PAT)

1. Go to `https://dev.azure.com/{your-organization}/_usersSettings/tokens`
2. Click **"New Token"**
3. Give it a name (e.g., "Bug Extractor")
4. Set expiration (recommended: 90 days)
5. Select scopes: **"Work Items (Read)"**
6. Click **"Create"**
7. **Copy the token immediately** (you won't see it again!)

### 2. Configure the Tool

Edit `azure-devops-config.json`:

```json
{
  "organization": "your-org-name",
  "project": "your-project-name", 
  "personalAccessToken": "your-pat-token-here",
  "outputFile": "bugs_export.csv",
  "filters": {
    "state": "Active",
    "assignedTo": "user@domain.com",
    "area": "MyProject\\Web",
    "priority": "1",
    "severity": "1 - Critical",
    "createdAfter": "2024-01-01",
    "tags": "UI"
  }
}
```

**Filter Options:**
- `state`: Active, Resolved, Closed, New
- `assignedTo`: Email address of assigned user
- `area`: Area path (use \\\\ for sub-areas)
- `priority`: 1, 2, 3, 4 (1 = highest)
- `severity`: "1 - Critical", "2 - High", "3 - Medium", "4 - Low"
- `createdAfter`: Date in YYYY-MM-DD format
- `tags`: Tag name to filter by

**Leave filters empty (`""`) to ignore them.**

## 🚀 Usage

### Option 1: Using npm script
```bash
npm run extract-bugs
```

### Option 2: Direct execution
```bash
node run-bug-extraction.js
```

## 📊 Output

The tool creates a CSV file with these columns:

- **ID** - Work item ID
- **Title** - Bug title
- **State** - Current state (Active, Resolved, etc.)
- **Assigned To** - Person assigned
- **Created By** - Person who created the bug
- **Created Date** - When the bug was created
- **Changed Date** - Last modification date
- **Priority** - Priority level (1-4)
- **Severity** - Severity level
- **Area Path** - Area/team path
- **Iteration Path** - Sprint/iteration
- **Tags** - Associated tags
- **Description** - Bug description (HTML stripped)
- **Repro Steps** - Reproduction steps
- **Acceptance Criteria** - Acceptance criteria

## 🔧 Troubleshooting

### Authentication Errors (401)
- Check your Personal Access Token is correct
- Ensure the token has "Work Items (Read)" permission
- Verify the token hasn't expired

### Not Found Errors (404)
- Verify organization name is correct
- Check project name spelling
- Ensure you have access to the project

### No Results
- Check your filters aren't too restrictive
- Verify the work item type is "Bug" in your project
- Try removing all filters to get all bugs

## 📝 Examples

### Get all active bugs:
```json
"filters": {
  "state": "Active"
}
```

### Get critical bugs assigned to you:
```json
"filters": {
  "severity": "1 - Critical",
  "assignedTo": "your.email@company.com"
}
```

### Get recent bugs from specific area:
```json
"filters": {
  "area": "MyProject\\Frontend",
  "createdAfter": "2024-11-01"
}
```

### Get all bugs (no filters):
```json
"filters": {}
```

## 🔒 Security Notes

- Never commit your PAT token to version control
- Add `azure-devops-config.json` to `.gitignore`
- Regenerate tokens periodically
- Use minimal required permissions (Work Items Read only)