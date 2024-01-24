// https://firebase.google.com/docs/functions/typescript
import * as admin from "firebase-admin";

admin.initializeApp();

export {storeImageUri} from "./file-storage";
export {getReposByInstallation} from "./github";
export {createUser, deleteUser} from "./user";
export {createProject, deleteProject} from "./project";
export {createTeam, deleteTeam, addUserToTeam} from "./team";
