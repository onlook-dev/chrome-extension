import { MESSAGING_NAMESPACE } from '$shared/message';
import { allowWindowMessaging } from "webext-bridge/content-script";

try {
	allowWindowMessaging(MESSAGING_NAMESPACE);
} catch (e) {
	console.error(e)
}
