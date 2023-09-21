# Clients Debt Tracker

Welcome to the Clients Debt Tracker, a Cross-Platform Debt Management Desktop App currently for small businesses and shops. This app is being developed using TypeScript, React, Tailwind, Rust, and Tauri.

## Installation

To get started with Clients Debt Tracker on your local machine, follow these simple steps:

### 1. Clone or Download

You can either clone the repository to your local machine or download it as a ZIP file and extract its contents.

### 2. Navigate to the Source Folder

Use your command line or terminal to navigate to the repository's source folder:

```bash
cd Credit-Manager
```
### 3. Installing Node Packages

Install the necessary Node.js packages by running:

```bash
npm install
```

### 4. Installing Rust Dependencies

Now, navigate to the src-tauri folder:

```bash
cd src-tauri
```

Install the Rust dependencies by updating Cargo:

```bash
cargo update
```

### 5. Return to the Root Folder and Run the Application

Return to the root folder of your project:

```bash
cd ..
npm run tauri dev
```

*Note:* The first time you run `npm run tauri dev`, the Rust package manager takes several minutes to download and build all the required packages. Since they are cached, subsequent builds are much faster, as only code inside src or src-tauri/src needs rebuilding.