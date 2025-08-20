# saucectl playwright example

Example running `saucectl` with Playwright, including configurations for localhost testing with Sauce Connect and dynamic test execution using tags.

## What You'll Need

The steps below illustrate one of the quickest ways to get set up. If you'd like a more in-depth guide, please check out our [documentation](https://docs.saucelabs.com/dev/cli/saucectl/#installing-saucectl).

### 1. Install `saucectl`

```bash
npm install saucectl -D
```

### 2. Set Your Sauce Labs Credentials

This will store your credentials for `saucectl` to use.

```bash
saucectl configure
```

---

## Running The Examples

This repository is configured to run tests in several ways.

### Running Standard Tests on a Public Website

These commands run the original tests against a public website.

```bash
# Run tests in your default configured region
saucectl run

# Explicitly run tests in US and EU data centers
npm run test.sauce.us
npm run test.sauce.eu
```

---

## Testing a Localhost Application with Sauce Connect

This section guides you through testing a simple, local web page using a Node.js server and a Sauce Connect tunnel.

### Step 1: Create a Local Web Page

Create a file named `index.html` in the root of the project with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Localhost Test</title>
</head>
<body>
    <h1>Hello from my Local Server!</h1>
</body>
</html>
```

### Step 2: Set Up the Local Server

We use the `serve` package to create a simple web server.

1. **Install `serve`:**

```bash
npm install serve -D
```

2. **Add a `start` script to `package.json`:**

```json
"scripts": {
  "start": "serve .",
  // ... your other scripts
},
```

### Step 3: Update the Playwright Test

Modify `tests/example.spec.js` to point to your local server.

```javascript
// tests/example.spec.js
const { test, expect } = require('@playwright/test');

test('homepage has the correct title on localhost @sanity', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Localhost Test/);
  const header = page.locator('h1');
  await expect(header).toHaveText('Hello from my Local Server!');
});
```

### Step 4: Configure `saucectl` to Use a Tunnel

Update your `.sauce/config.yml` to tell `saucectl` to use an active tunnel.

```yaml
# .sauce/config.yml
sauce:
  tunnel:
    name: "my-local-test-tunnel"
```

### Step 5: Run the Local Test

You will need **three separate terminals** running in your project directory.

1. **Terminal 1: Start the Local Server**

```bash
npm start
```

2. **Terminal 2: Start the Sauce Connect Tunnel**
*(Requires Sauce Connect to be installed)*

```bash
# The --proxy-localhost allow flag is critical
sc run -i my-local-test-tunnel --proxy-localhost allow
```

3. **Terminal 3: Run the `saucectl` Test**

```bash
saucectl run
```

---

## Running Tests Dynamically with Tags

This setup allows you to run specific subsets of tests (e.g., `@sanity`, `@regression`) in your CI/CD pipeline without changing code.

### Step 1: Tag Your Tests

Add tags like `@sanity` to the title of your tests in your `.spec.js` files.

```javascript
test('My feature test @sanity @regression', async ({ page }) => {
  // ...
});
```

### Step 2: Update `config.yml` to be Dynamic

Modify your `.sauce/config.yml` to read the tag from an environment variable.

```yaml
# .sauce/config.yml
suites:
  - name: "Playwright Dynamic Tests"
    params:
      # This will use the value from the PLAYWRIGHT_GREP variable at runtime
      grep: "${PLAYWRIGHT_GREP}"
```

### Step 3: Run Tagged Tests from Your Terminal

Set the environment variable before the `saucectl run` command.

```bash
# Run only sanity tests
PLAYWRIGHT_GREP="@sanity" saucectl run

# Run only regression tests
PLAYWRIGHT_GREP="@regression" saucectl run
```

## The Config

[Follow me](.sauce/config.yml) if you'd like to see how `saucectl` is configured for this repository. Our IDE Integrations (e.g. [Visual Studio Code](https://docs.saucelabs.com/dev/cli/saucectl/usage/ide/vscode)) can help you out by validating the YAML files and provide handy suggestions, so make sure to check them out!

