#!/usr/bin/env node

// scripts/allure-report.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Allure report generation and management script
 * Cross-platform support for Windows, Linux, and macOS
 */

const ALLURE_RESULTS = path.join(process.cwd(), 'allure-results');
const ALLURE_REPORT = path.join(process.cwd(), 'allure-report');
const HISTORY_DIR = path.join(ALLURE_REPORT, 'history');
const HISTORY_BACKUP = path.join(process.cwd(), '.allure-history');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'generate';
const options = {
  open: args.includes('--open') || args.includes('-o'),
  clean: args.includes('--clean') || args.includes('-c'),
  singleFile: args.includes('--single-file') || args.includes('-s'),
  serve: args.includes('--serve'),
  history: args.includes('--history') || args.includes('-h')
};

/**
 * Check if Allure CLI is installed
 */
function checkAllureInstalled() {
  try {
    execSync('allure --version', { stdio: 'ignore' });
    return true;
  } catch {
    console.error('❌ Allure CLI is not installed!');
    console.log('Please install it using: npm install -g allure-commandline');
    return false;
  }
}

/**
 * Create directories if they don't exist
 */
function ensureDirectories() {
  if (!fs.existsSync(ALLURE_RESULTS)) {
    fs.mkdirSync(ALLURE_RESULTS, { recursive: true });
    console.log(`📁 Created directory: ${ALLURE_RESULTS}`);
  }
}

/**
 * Preserve history from previous reports
 */
function preserveHistory() {
  if (fs.existsSync(HISTORY_DIR)) {
    console.log('📚 Preserving report history...');
    
    // Backup history
    if (fs.existsSync(HISTORY_BACKUP)) {
      fs.rmSync(HISTORY_BACKUP, { recursive: true, force: true });
    }
    
    fs.cpSync(HISTORY_DIR, HISTORY_BACKUP, { recursive: true });
    console.log('✅ History preserved');
  }
}

/**
 * Restore history to new report
 */
function restoreHistory() {
  if (fs.existsSync(HISTORY_BACKUP)) {
    console.log('📚 Restoring report history...');
    
    if (!fs.existsSync(ALLURE_REPORT)) {
      fs.mkdirSync(ALLURE_REPORT, { recursive: true });
    }
    
    const newHistoryDir = path.join(ALLURE_REPORT, 'history');
    if (!fs.existsSync(newHistoryDir)) {
      fs.mkdirSync(newHistoryDir, { recursive: true });
    }
    
    fs.cpSync(HISTORY_BACKUP, newHistoryDir, { recursive: true });
    console.log('✅ History restored');
  }
}

/**
 * Clean allure results and reports
 */
function cleanAllure() {
  console.log('🧹 Cleaning Allure directories...');
  
  if (fs.existsSync(ALLURE_RESULTS)) {
    fs.rmSync(ALLURE_RESULTS, { recursive: true, force: true });
    fs.mkdirSync(ALLURE_RESULTS, { recursive: true });
    console.log('✅ Cleaned allure-results');
  }
  
  if (fs.existsSync(ALLURE_REPORT)) {
    // Preserve history before cleaning
    if (options.history) {
      preserveHistory();
    }
    
    fs.rmSync(ALLURE_REPORT, { recursive: true, force: true });
    console.log('✅ Cleaned allure-report');
  }
}

/**
 * Generate Allure report
 */
function generateReport() {
  console.log('📊 Generating Allure report...');
  
  // Check if there are results to generate report from
  if (!fs.existsSync(ALLURE_RESULTS) || fs.readdirSync(ALLURE_RESULTS).length === 0) {
    console.warn('⚠️ No test results found in allure-results directory');
    console.log('Run tests first to generate results');
    return false;
  }
  
  try {
    // Build command
    let generateCommand = `allure generate ${ALLURE_RESULTS} -o ${ALLURE_REPORT}`;
    
    if (options.clean && !options.history) {
      generateCommand += ' --clean';
    }
    
    if (options.singleFile) {
      generateCommand += ' --single-file';
      console.log('📄 Generating single-file report...');
    }
    
    // Execute command
    execSync(generateCommand, { stdio: 'inherit' });
    
    // Restore history if needed
    if (options.history) {
      restoreHistory();
    }
    
    console.log('✅ Report generated successfully!');
    console.log(`📁 Report location: ${ALLURE_REPORT}`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to generate report:', error.message);
    return false;
  }
}

/**
 * Open Allure report in browser
 */
function openReport() {
  console.log('🌐 Opening Allure report...');
  
  if (!fs.existsSync(path.join(ALLURE_REPORT, 'index.html'))) {
    console.error('❌ Report not found. Generate it first.');
    return;
  }
  
  try {
    execSync(`allure open ${ALLURE_REPORT}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to open report:', error.message);
  }
}

/**
 * Serve Allure report (with auto-refresh)
 */
function serveReport() {
  console.log('🚀 Starting Allure report server...');
  
  if (!fs.existsSync(ALLURE_RESULTS) || fs.readdirSync(ALLURE_RESULTS).length === 0) {
    console.warn('⚠️ No test results found');
    return;
  }
  
  try {
    console.log('Server will auto-refresh when new results are added');
    console.log('Press Ctrl+C to stop the server\n');
    execSync(`allure serve ${ALLURE_RESULTS}`, { stdio: 'inherit' });
  } catch (error) {
    if (error.signal !== 'SIGINT') {
      console.error('❌ Failed to serve report:', error.message);
    }
  }
}

/**
 * Display usage information
 */
function showUsage() {
  console.log(`
📊 Allure Report Manager

Usage: node scripts/allure-report.js [command] [options]

Commands:
  generate    Generate Allure report (default)
  serve       Start Allure server with auto-refresh
  clean       Clean results and reports
  help        Show this help message

Options:
  --open, -o        Open report after generation
  --clean, -c       Clean before generating
  --single-file, -s Generate single-file report
  --history, -h     Preserve report history
  --serve           Serve report with live reload

Examples:
  node scripts/allure-report.js                    # Generate report
  node scripts/allure-report.js --open            # Generate and open
  node scripts/allure-report.js --single-file     # Generate single file
  node scripts/allure-report.js serve             # Start server
  node scripts/allure-report.js clean             # Clean directories
  `);
}

/**
 * Main execution
 */
function main() {
  console.log('🎯 PerfectDraft Allure Report Manager\n');
  
  // Check Allure installation
  if (!checkAllureInstalled()) {
    process.exit(1);
  }
  
  // Ensure directories exist
  ensureDirectories();
  
  // Execute command
  switch (command) {
    case 'clean':
      cleanAllure();
      break;
      
    case 'serve':
      serveReport();
      break;
      
    case 'help':
      showUsage();
      break;
      
    case 'generate':
    default:
      if (options.clean) {
        cleanAllure();
      }
      
      const success = generateReport();
      
      if (success && options.open) {
        openReport();
      } else if (success && options.serve) {
        serveReport();
      }
      break;
  }
}

// Run the script
main();