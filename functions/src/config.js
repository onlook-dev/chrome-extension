const fs = require("fs");
const { exec } = require("child_process");

// Function to parse .env file
const parseEnvFile = (filePath) => {
  const vars = {};
  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  fileContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      vars[key.trim()] = value.trim();
    }
  });
  return vars;
};

// Parse the .env file
const envFilePath = "./.env"; // Adjust the path if your .env file is located elsewhere
const envVars = parseEnvFile(envFilePath);

// Create a command to set each variable in Firebase
Object.keys(envVars).forEach((key) => {
  const value = envVars[key];
  const command = `firebase functions:config:set config.key="${key}" config.pass="${value}"`;
  console.log(command);
});
