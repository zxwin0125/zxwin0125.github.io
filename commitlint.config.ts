const Configuration = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-empty': [0, 'never'],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']
    ],
    'subject-empty': [2, 'never'],
    'body-empty': [0, 'never']
  },
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit'
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features'
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes'
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation'
          },
          style: {
            description:
              'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
            title: 'Styles'
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring'
          },
          perf: {
            description: 'A code change that improves performance',
            title: 'Performance Improvements'
          },
          test: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests'
          },
          build: {
            description:
              'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
            title: 'Builds'
          },
          ci: {
            description:
              'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations'
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: 'Chores'
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts'
          }
        }
      }
    }
  }
}

export default Configuration
