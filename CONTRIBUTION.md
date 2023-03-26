# Contribution Guidelines

## How to contribute

### Internal Members

1. Create a branch with the name of the feature you are working on. like `feature/feature-name`
2. After you are done with the feature, create a pull request to the `main` branch.
3. The pull request will be reviewed by the other members of the team.
4. If the pull request is approved, it will be merged to the `main` branch.
5. Otherwise, the reviewer will give you feedback on what needs to be changed.
6. After the pull request is merged, you can delete the branch.

## Code linting & formatting

We are using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to lint and format our code. You can run the following commands to lint and format your code:

```bash
npm run lint
npm run format
```

## Commit messages

We are using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to write our commit messages.
We also use [Angular Commit Message Conventions](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format) for extra rules.

### Generate commit messages

You can use the following command to generate a commit message:

```bash
npm commit
```

This will open a prompt where you can choose the type of commit, the scope of the commit, and the commit message.

### Check commit messages

Or once you have finished your commit message, you can run the following command to check if it is valid:

```bash
echo "your commit message" | npx commitlint
or 
echo "your commit message" | commitlint
```

### VSCode

Or you can use [git-commit-plugin](https://marketplace.visualstudio.com/items?itemName=redjue.git-commit-plugin) for VSCode.
However, there is some extra configuration needed for this plugin to work with the newest Angular Commit Message Conventions.
Add the following to your `settings.json` file:

```json
{
    "git-commit-plugin.CustomCommitType": [
        "ci",
        "build"
    ]
}
```

and make sure you do not use the `chore` type.

## Pull request

When you create a pull request, make sure you add the following information:

- What the pull request is about
- How to test the pull request
- What the reviewer should look for
- What the reviewer should test
Please write the title using the [commit message format](#commit-messages).
