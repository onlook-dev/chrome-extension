#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Command } from "commander";

function findJsLinks(folderPath: string, remove: boolean = false): void {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isDirectory()) {
            findJsLinks(filePath, remove);
        } else if (fileStat.isFile() && path.extname(filePath) === ".js") {
            let fileContent = fs.readFileSync(filePath, "utf-8");
            // Improved regex that checks for URLs not followed by characters commonly found in template literals or function calls
            const links = fileContent.match(/https?:\/\/(?!.*redux)[^\s")]+\.js(?!\w)/g);
            if (links) {
                console.log(`JS link(s) found in ${filePath}:`);
                console.log(links);
                if (remove) {
                    links.forEach((link) => {
                        fileContent = fileContent.replace(link, "");
                    });
                    fs.writeFileSync(filePath, fileContent);
                    console.log(`JS link(s) removed from ${filePath}`);
                } else {
                    console.error("links found");
                }
            }
        }
    }
}

const program = new Command();

program
    .name("bad firebase links")
    .usage("<folder> [options]")
    .description(
        "find JS links in a folder that google doesn't like (mostly firebase ones apparently)"
    )
    .argument("<folder>", "Folder to find JS links in")
    .option("-r, --remove", "Remove the JS links")
    .action((folder, options, command) => {
        findJsLinks(folder, options.remove);
    });

program.parse(process.argv);