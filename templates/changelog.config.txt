module.exports = {
    disableEmoji: false,
    format: '{type}{scope}: {emoji}{subject}',
    list: ['test', 'improvement', 'types', 'build', 'feat', 'fix', 'chore', 'docs', 'refactor', 'style', 'ci', 'perf', 'merge'],
    maxMessageLength: 64,
    minMessageLength: 3,
    questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues', 'lerna'],
    scopes: [],
    types: {
        improvement: {
            description: 'Improvement in performance or quality',
            emoji: '🚀',
            value: 'improvement'
        },
        types: {
            description: 'Changes related to data types',
            emoji: '🧬',
            value: 'types'
        },
        build: {
            description: 'Changes that affect the build system or external dependencies',
            emoji: '🛠️',
            value: 'build'
        },
        ci: {
            description: 'CI/CD related changes',
            emoji: '🔧',
            value: 'ci'
        },
        chore: {
            description: 'Routine tasks, maintenance, or tooling changes',
            emoji: '🛠️',
            value: 'chore'
        },
        docs: {
            description: 'Documentation only changes',
            emoji: '📚',
            value: 'docs'
        },
        feat: {
            description: 'A new feature for the user',
            emoji: '✨',
            value: 'feat'
        },
        fix: {
            description: 'A bug fix',
            emoji: '🐞',
            value: 'fix'
        },
        perf: {
            description: 'A code change that improves performance',
            emoji: '⚡️',
            value: 'perf'
        },
        refactor: {
            description: 'Code changes that neither fix a bug nor add a feature',
            emoji: '🔨',
            value: 'refactor'
        },
        release: {
            description: 'Create a release commit',
            emoji: '🏹',
            value: 'release'
        },
        style: {
            description: 'Markup, white-space, formatting, or style changes',
            emoji: '💅',
            value: 'style'
        },
        test: {
            description: 'Adding missing tests or improving existing ones',
            emoji: '🧪',
            value: 'test'
        },
        merge: {
            description: 'Merged branches',
            emoji: '🔄',
            value: 'merge'
        },
        messages: {
            type: 'Select the type of change that you\'re committing:',
            customScope: 'Select the scope this component affects:',
            subject: 'Write a short, imperative mood description of the change:\n',
            body: 'Provide a longer description of the change:\n ',
            breaking: 'List any breaking changes:\n',
            footer: 'Issues this commit closes, e.g #123:',
            confirmCommit: 'The packages that this commit has affected\n',
        },
    }
};
