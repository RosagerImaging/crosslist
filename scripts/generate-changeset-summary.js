import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const prompts = require("prompts");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateChangesetSummary() {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    console.error("Error: GEMINI_API_KEY environment variable is not set.");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // 1. Get recent commit messages
  console.log("Fetching recent commit messages...");
  let commitMessages;
  try {
    // Get commits since the last tag or a reasonable default
    const lastTag = execSync("git describe --tags --abbrev=0 2>/dev/null").toString().trim();
    const commitRange = lastTag ? `${lastTag}..HEAD` : "HEAD~10..HEAD"; // Last 10 commits if no tag
    commitMessages = execSync(`git log --pretty=format:"- %s" ${commitRange}`).toString().trim();
  } catch (error) {
    console.warn("Could not determine last git tag or fetch commit messages. Using a default range.");
    commitMessages = execSync(`git log --pretty=format:"- %s" HEAD~10..HEAD`).toString().trim();
  }

  if (!commitMessages) {
    console.log("No recent commit messages found to summarize.");
    process.exit(0);
  }

  console.log("\n--- Commit Messages to Summarize ---");
  console.log(commitMessages);
  console.log("------------------------------------\n");

  // 2. Call the Gemini API to generate a summary
  console.log("Generating summary with Gemini AI...");
  const prompt = `You are an expert software engineer tasked with writing a concise and professional changelog entry.
Summarize the following commit messages into a single, coherent, and user-friendly changelog entry.
Focus on user-facing changes, new features, bug fixes, and performance improvements.
Group related changes logically. Use clear and positive language.
Do not include internal refactoring unless it has a direct user impact.
The summary should be suitable for a markdown file.

Commit Messages:
${commitMessages}

Changelog Summary:`;

  let summary = "";
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    summary = response.text().trim();
    console.log("AI Generated Summary:\n", summary);
  } catch (error) {
    console.error("Error generating summary with Gemini AI:", error);
    process.exit(1);
  }

  // 3. Prompt the user for affected packages and version type
  const packagesDir = path.join(__dirname, "../packages");
  const appsDir = path.join(__dirname, "../apps");

  const getPackageNames = (dir) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  };

  const allPackages = [
    ...getPackageNames(packagesDir).map(name => `packages/${name}`),
    ...getPackageNames(appsDir).map(name => `apps/${name}`),
  ];

  const response = await prompts([
    {
      type: "multiselect",
      name: "affectedPackages",
      message: "Select affected packages:",
      choices: allPackages.map(pkg => ({ title: pkg, value: pkg })),
      min: 1,
      hint: "- Space to select. Return to submit.",
    },
    {
      type: "select",
      name: "versionType",
      message: "Select version type:",
      choices: [
        { title: "patch", value: "patch" },
        { title: "minor", value: "minor" },
        { title: "major", value: "major" },
      ],
      initial: 0,
    },
  ]);

  if (!response.affectedPackages || !response.versionType) {
    console.log("Changeset creation cancelled.");
    process.exit(0);
  }

  // 4. Create a .changeset/*.md file
  const changesetContent = `---
${response.affectedPackages.map(pkg => `"${pkg}": ${response.versionType}`).join("\n")}
---

${summary}
`;

  const changesetFileName = `changeset-${Date.now()}.md`;
  const changesetFilePath = path.join(__dirname, "../.changeset", changesetFileName);

  fs.writeFileSync(changesetFilePath, changesetContent);
  console.log(`\nChangeset created at: ${changesetFilePath}`);
  console.log("Please review the generated changeset file and commit it.");
  console.log("You can then run `npx changeset version` to apply the changes.");
}

generateChangesetSummary();
