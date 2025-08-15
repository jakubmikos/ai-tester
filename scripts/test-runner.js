#!/usr/bin/env node

// scripts/test-runner.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Advanced test runner with pre-flight checks and reporting
 */

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  suite: args[0] || 'all',
  browser: args.find(arg => arg.startsWith('--browser='))?.split('=')[1] || 'chromium',
  headed: args.includes('--headed'),
  debug: args.includes('--debug'),
  report: args.includes('--report'),
  workers: args.find(arg => arg.startsWith('--workers='))?.split('=')[1] || undefined,
  retries: args.find(arg => arg.startsWith('--retries='))?.split('=')[1] || undefined,
  grep: args.find(arg => arg.startsWith('--grep='))?.split('=')[1] || undefined
};

/**
 * Log with color
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Check prerequisites
 */
function checkPrerequisites() {
  log('\n🔍 Running pre-flight checks...', 'cyan');
  
  const checks = [
    {
      name: 'Node.js version',
      check: () => {
        const version = process.version;
        const major = parseInt(version.split('.')[0].substring(1));
        return major >= 18;
      },
      error: 'Node.js 18+ is required'
    },
    {
      name: 'Dependencies installed',
      check: () => fs.existsSync('node_modules'),
      error: 'Run "npm install" first'
    },
    {
      name: 'Playwright browsers',
      check: () => {
        const playwrightPath = path.join(
          process.env.LOCALAPPDATA || process.env.HOME,
          'ms-playwright'
        );
        return fs.existsSync(playwrightPath);
      },
      error: 'Run "npm run playwright:install" first'
    },
    {
      name: 'Feature files',
      check: () => {
        const featuresDir = path.join('src', 'features');
        return fs.existsSync(featuresDir) && 
               fs.readdirSync(featuresDir).some(f => f.endsWith('.feature'));
      },
      error: 'No feature files found in src/features'
    },
    {
      name: 'Environment configuration',
      check: () => fs.existsSync('.env') || process.env.BASE_URL,
      error: 'Create .env file or set BASE_URL environment variable'
    }
  ];

  let allPassed = true;
  
  for (const check of checks) {
    process.stdout.write(`  Checking ${check.name}... `);
    
    try {
      if (check.check()) {
        log('✅', 'green');
      } else {
        log('❌', 'red');
        log(`    ${check.error}`, 'yellow');
        allPassed = false;
      }
    } catch (error) {
      log('❌', 'red');
      log(`    ${check.error}`, 'yellow');
      allPassed = false;
    }
  }

  return allPassed;
}

/**
 * Get test command based on options
 */
function getTestCommand() {
  const commands = [];
  
  // Base command
  commands.push('npx', 'playwright', 'test');

  // Test suite selection
  switch (options.suite) {
    case 'smoke':
      commands.push('--grep', '@Smoke');
      break;
    case 'regression':
      commands.push('--grep', '@Regression');
      break;
    case 'critical':
      commands.push('--grep', '@Critical');
      break;
    case 'p1':
      commands.push('--grep', '@P1');
      break;
    case 'p2':
      commands.push('--grep', '@P2');
      break;
    case 'p3':
      commands.push('--grep', '@P3');
      break;
    case 'all':
    default:
      // Run all tests
      break;
  }

  // Custom grep pattern
  if (options.grep) {
    commands.push('--grep', options.grep);
  }

  // Browser selection
  if (options.browser !== 'all') {
    commands.push('--project', options.browser);
  }

  // Headed mode
  if (options.headed) {
    commands.push('--headed');
  }

  // Debug mode
  if (options.debug) {
    commands.push('--debug');
  }

  // Workers
  if (options.workers) {
    commands.push('--workers', options.workers);
  }

  // Retries
  if (options.retries) {
    commands.push('--retries', options.retries);
  }

  return commands;
}

/**
 * Run tests
 */
function runTests() {
  return new Promise((resolve, reject) => {
    const command = getTestCommand();
    
    log('\n🚀 Running tests...', 'cyan');
    log(`   Command: ${command.join(' ')}`, 'bright');
    log(`   Suite: ${options.suite}`, 'bright');
    log(`   Browser: ${options.browser}`, 'bright');
    log(`   Mode: ${options.headed ? 'Headed' : 'Headless'}`, 'bright');
    
    const startTime = Date.now();
    const child = spawn(command[0], command.slice(1), {
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        FORCE_COLOR: '1'
      }
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;
      const minutes = Math.floor(duration / 60000);
      const seconds = ((duration % 60000) / 1000).toFixed(0);
      
      log(`\n⏱️  Test execution time: ${minutes}m ${seconds}s`, 'cyan');
      
      if (code === 0) {
        log('✅ All tests passed!', 'green');
        resolve(code);
      } else {
        log(`❌ Tests failed with exit code: ${code}`, 'red');
        reject(code);
      }
    });

    child.on('error', (error) => {
      log(`❌ Failed to run tests: ${error.message}`, 'red');
      reject(error);
    });
  });
}

/**
 * Generate report
 */
function generateReport() {
  return new Promise((resolve, reject) => {
    log('\n📊 Generating Allure report...', 'cyan');
    
    const child = spawn('npm', ['run', 'allure:generate'], {
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        log('✅ Report generated successfully!', 'green');
        
        // Open report if requested
        if (options.report) {
          spawn('npm', ['run', 'allure:open'], {
            stdio: 'inherit',
            shell: true
          });
        }
        
        resolve(code);
      } else {
        log('⚠️  Report generation failed', 'yellow');
        reject(code);
      }
    });
  });
}

/**
 * Display usage
 */
function showUsage() {
  console.log(`
${colors.cyan}🎯 PerfectDraft Test Runner${colors.reset}

Usage: node scripts/test-runner.js [suite] [options]

Suites:
  all         Run all tests (default)
  smoke       Run smoke tests (@Smoke)
  regression  Run regression tests (@Regression)
  critical    Run critical tests (@Critical)
  p1          Run P1 priority tests (@P1)
  p2          Run P2 priority tests (@P2)
  p3          Run P3 priority tests (@P3)

Options:
  --browser=<name>   Browser to use (chromium, firefox, webkit, all)
  --headed           Run in headed mode
  --debug            Run in debug mode
  --report           Generate and open report after tests
  --workers=<n>      Number of parallel workers
  --retries=<n>      Number of retries for failed tests
  --grep=<pattern>   Custom grep pattern

Examples:
  node scripts/test-runner.js smoke --browser=firefox
  node scripts/test-runner.js regression --headed --report
  node scripts/test-runner.js all --workers=4 --retries=2
  node scripts/test-runner.js --grep="@P1 and @Checkout"
  `);
}

/**
 * Main execution
 */
async function main() {
  log('🍺 PerfectDraft Test Automation', 'magenta');
  log('================================\n', 'magenta');

  // Show help if requested
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    process.exit(0);
  }

  // Run pre-flight checks
  if (!checkPrerequisites()) {
    log('\n❌ Pre-flight checks failed. Please fix the issues above.', 'red');
    process.exit(1);
  }

  log('\n✅ All pre-flight checks passed!', 'green');

  try {
    // Run tests
    await runTests();
    
    // Generate report if requested
    if (options.report) {
      await generateReport();
    }
    
    log('\n🎉 Test run completed successfully!', 'green');
    process.exit(0);
  } catch (error) {
    log('\n💥 Test run failed!', 'red');
    
    // Still try to generate report on failure
    if (options.report) {
      try {
        await generateReport();
      } catch {
        // Ignore report generation errors
      }
    }
    
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});